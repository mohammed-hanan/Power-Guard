from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import firebase_admin
from firebase_admin import credentials, firestore
import os
import sys

# Ensure output is visible in non-interactive terminals
os.environ['PYTHONUNBUFFERED'] = '1'

# ================================================================
# 1. FIREBASE CONNECTION
# ================================================================
db = None
if os.path.exists("serviceAccountKey.json"):
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("Firebase connected!")
else:
    print("WARNING: serviceAccountKey.json not found.")

# ================================================================
# 2. SELF-LEARNING MODEL VARIABLES
# ================================================================
BASELINE_REQUIRED = 30
BASELINE_FILE = "baseline.json"
collected_data = []
model = None
scaler = None
learned_min = 200 # Default fallback
learned_max = 1000 # Default fallback
training_done = False

import json

def load_baseline():
    global learned_min, learned_max, training_done
    if os.path.exists(BASELINE_FILE):
        try:
            with open(BASELINE_FILE, 'r') as f:
                data = json.load(f)
                learned_min = data.get('min', 200)
                learned_max = data.get('max', 1000)
                training_done = True
                print(f"📁 Loaded Saved Baseline: {learned_min}W - {learned_max}W")
        except:
            print("Could not read baseline file.")

def save_baseline(m, mx):
    with open(BASELINE_FILE, 'w') as f:
        json.dump({'min': m, 'max': mx}, f)

# Load on startup
load_baseline()

def process_power(power_value, device_id):
    global collected_data, model, scaler, learned_min, learned_max, training_done

    # RESET DETECTION: If we get 10 consecutive readings that are 
    # massively off the baseline, we might need a re-train (like after calibration)
    # For now, let's keep it simple and focus on manual reset or restart.

    # PHASE 1: COLLECTING
    if not training_done:
        if len(collected_data) < BASELINE_REQUIRED:
            collected_data.append(power_value)
            print(f"[{device_id}] Learning Baseline: {len(collected_data)}/{BASELINE_REQUIRED}")
            return "COLLECTING"
        
        # PHASE 2: TRAINING
        print(f"\n⚡ [{device_id}] Training AI...")
        df = pd.DataFrame(collected_data, columns=['Power'])
        mean = df['Power'].mean()
        
        # Define Normal Range with 30% Buffer (minimum 3W buffer for sensitive loads)
        buffer = max(3.0, mean * 0.30)
        learned_min = round(max(0.0, mean - buffer), 1)  # Allow values down to 0W
        learned_max = round(mean + buffer, 1)

        save_baseline(learned_min, learned_max)
        print(f"✅ AI Ready! Range: {learned_min}W - {learned_max}W")
        
        if db is not None:
            db.collection("devices").document(device_id).set({
                "expectedMin": learned_min,
                "expectedMax": learned_max,
                "status": "online"
            }, merge=True)

        training_done = True
        return "NORMAL"

    # PHASE 3: MONITORING
    is_fault = (power_value < learned_min or power_value > learned_max)
    
    if is_fault:
        print(f"🚨 ANOMALY: {power_value:.1f}W (Normal Range: {learned_min}-{learned_max}W)")
        return "FAULT"
    else:
        print(f"Normal: {power_value:.1f}W")
        return "NORMAL"

# ================================================================
# 3. FLASK API
# ================================================================
app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json(force=True)
        power = float(data.get('power', 0))
        current = float(data.get('current', 0))
        voltage = float(data.get('voltage', 0))
        device_id = str(data.get('device_id', 'esp32_sensor_01'))
        device_name = str(data.get('device_name', 'ESP32 Energy Monitor'))

        status = process_power(power, device_id)

        # Update Firestore
        if db is not None:
            power_kw = round(power / 1000.0, 4)
            db.collection("devices").document(device_id).set({
                "power": power_kw,
                "current": current,
                "voltage": voltage,
                "status": "online",
                "last_update": firestore.SERVER_TIMESTAMP,
                "expectedMin": learned_min,
                "expectedMax": learned_max
            }, merge=True)

            if status == "FAULT":
                db.collection("alerts").add({
                    "device": device_name,
                    "message": f"Anomaly: {power:.1f}W (Limit: {learned_min}-{learned_max}W)",
                    "severity": "critical",
                    "is_anomaly": True,
                    "timestamp": firestore.SERVER_TIMESTAMP
                })

        return jsonify({"status": status, "trained": training_done})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/reset_ai', methods=['POST'])
def reset_ai():
    global collected_data, training_done, learned_min, learned_max
    collected_data = []
    training_done = False
    learned_min = 200
    learned_max = 1000
    if os.path.exists(BASELINE_FILE):
        os.remove(BASELINE_FILE)
    print("🧹 AI Baseline Reset! Ready to re-learn.")
    return jsonify({"message": "AI Baseline Reset. Starting re-learning phase..."})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
