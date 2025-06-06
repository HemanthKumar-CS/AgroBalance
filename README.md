# Agricultural Assistant

Agricultural Assistant is a smart, end-to-end precision farming solution that leverages real-time soil sensor data and machine learning models to recommend optimal crops and fertilizers for farmers. The system automates and enhances agricultural decision-making by integrating hardware (soil NPK sensor), data preprocessing, and advanced ML inference within user-friendly web and mobile interfaces.

---

## Table of Contents

- [Features](#features)
- [System Architecture](#system-architecture)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [Machine Learning Models](#machine-learning-models)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Features

- **Real-time Soil Sensing:** Reads soil parameters (N, P, K, pH, moisture, temperature) from a Modbus RTU-compatible sensor.
- **ML-based Crop Recommendation:** Suggests the most suitable crop for current soil and environmental conditions using neural network and random forest models.
- **Fertilizer Recommendation:** Recommends the best fertilizer type and application rate, tailored to the predicted crop and soil status.
- **Dual Input Mode:** Supports both automatic sensor-based input and manual data entry.
- **Web Interface:** Clean, responsive UI for data input, sensor reading, and displaying recommendations.
- **Mobile App:** Cross-platform mobile frontend built with Expo/React Native.
- **Sensor Testing Utility:** Standalone script to verify sensor connectivity and output.

---

## System Architecture

### 1. Hardware Layer

- **Soil Sensor:** Measures Nitrogen (N), Phosphorus (P), Potassium (K), pH, moisture, and temperature.
- **Connection:** Communicates via serial port (default: `COM3`) using the Modbus RTU protocol.

### 2. Backend (Flask Application)

- **Sensor Integration:** Reads sensor data using `minimalmodbus` and `pyserial`.
- **ML Inference:** Loads pre-trained models and encoders from the `models/` directory.
- **API Endpoints:**
  - `/read_sensor`: Returns live sensor readings as JSON.
  - `/predict`: Accepts form data (from sensor or manual input), runs ML models, and returns recommendations.
- **Business Logic:** Maps crops to fertilizer categories, calculates fertilizer amounts based on soil efficiency factors, and handles all preprocessing.

### 3. Frontend

- **Web:** HTML/CSS/JS in `backend/templates/index.html` and `backend/static/styles.css`.
- **Mobile:** Expo/React Native app in the `frontend/` directory.
- **Sensor Controls:** "Read from Sensor" button fetches and auto-fills form fields (web).
- **Form Submission:** User can submit either sensor-populated or manually entered data for recommendations.
- **Results Display:** Shows recommended crop, fertilizer type, and suggested application rate.

---

## Folder Structure

```
backend/
├── app.py                      # Main Flask application
├── check.py                    # Sensor testing utility
├── requirements.txt            # Python dependencies
├── crop_recommendation.csv     # Training data for crop models
├── fertilizer_recommendation.csv # Training data for fertilizer models
├── Training.ipynb              # Jupyter notebook with model training code
├── models/                     # Trained ML models and preprocessing objects
│   ├── crop_model.keras
│   ├── fertilizer_model.keras
│   ├── rf_crop_model.pkl
│   ├── rf_fertilizer_model.pkl
│   ├── scaler_crop.pkl
│   ├── scaler_fertilizer.pkl
│   ├── encoder_crop.pkl
│   ├── fertilizer_label_encoder.pkl
│   ├── soil_type_encoder.pkl
│   └── crop_type_encoder.pkl
├── static/
│   └── styles.css              # Custom CSS for UI
└── templates/
    └── index.html              # Main HTML template

frontend/
├── App.js                      # Entry point for Expo app
├── package.json                # NPM dependencies and scripts
├── app/                        # Main app source (Expo/React Native)
├── components/                 # Reusable UI components
├── constants/                  # App-wide constants
├── hooks/                      # Custom React hooks
├── scripts/                    # Utility scripts
├── src/                        # Source utilities and API services
├── assets/                     # Images and other assets
└── ...                         # Other Expo/React Native config files
```

---

## Getting Started

### Backend Setup

1. **Install Python dependencies:**

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Test sensor connection (optional):**

   ```bash
   python check.py
   ```

3. **Run the Flask web application:**
   ```bash
   python app.py
   ```
   The app will be available at [http://127.0.0.1:5000](http://127.0.0.1:5000).

### Frontend Setup

1. **Install Node.js dependencies:**

   ```bash
   cd frontend
   npm install
   ```

2. **Start the Expo app:**
   ```bash
   npx expo start
   ```
   Follow the Expo CLI instructions to run the app on your device or emulator.

---

## Usage

- **Web:** Open the web interface in your browser. Use the "Read from Sensor" button to fetch live soil data or enter values manually. Submit the form to receive crop and fertilizer recommendations.
- **Mobile:** Use the Expo app to access the same functionality on your mobile device.
- **Sensor Testing:** Run `check.py` to verify sensor output and troubleshoot hardware issues.

---

## Machine Learning Models

- **Crop Recommendation:**
  - `crop_model.keras` (Neural Network)
  - `rf_crop_model.pkl` (Random Forest)
  - `scaler_crop.pkl`, `encoder_crop.pkl`, `crop_type_encoder.pkl` (Preprocessing)
- **Fertilizer Recommendation:**
  - `fertilizer_model.keras` (Neural Network)
  - `rf_fertilizer_model.pkl` (Random Forest)
  - `scaler_fertilizer.pkl`, `fertilizer_label_encoder.pkl`, `soil_type_encoder.pkl` (Preprocessing)
- **Training Data:** `crop_recommendation.csv`, `fertilizer_recommendation.csv`
- **Training Notebook:** `Training.ipynb` contains all model training and export code.

---

## Customization

- **Sensor Port:** Change the serial port in `app.py` and `check.py` if your sensor is not on `COM3`.
- **Model Retraining:** Use `Training.ipynb` to retrain models with new data and export updated model files.
- **UI:** Modify `templates/index.html` and `static/styles.css` for branding or layout changes.
- **Mobile App:** Update React Native components in `frontend/app/` and `frontend/components/`.

---

## Troubleshooting

- **Sensor Not Detected:** Ensure the sensor is connected and powered. Check the serial port configuration.
- **Model Loading Errors:** Verify that all model and encoder files are present in the `models/` directory.
- **Frontend/Backend Connection:** Ensure the backend Flask server is running and accessible from your frontend app.

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and new features.

---

## License

This project is licensed under the MIT License.

---
