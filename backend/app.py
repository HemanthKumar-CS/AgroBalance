import time
import warnings

import joblib
import minimalmodbus
import numpy as np
import serial
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from tensorflow.keras.models import load_model  # type: ignore

warnings.filterwarnings("ignore")

app = Flask(__name__)
CORS(app)  # Enable CORS

# Load models and preprocessing objects (keep your existing code here)
try:
    crop_model = load_model('./models/crop_model.keras')
    fertilizer_model = load_model('./models/fertilizer_model.keras')
    rf_crop_model = joblib.load('./models/rf_crop_model.pkl')
    rf_fertilizer_model = joblib.load('./models/rf_fertilizer_model.pkl')
    scaler_crop = joblib.load('./models/scaler_crop.pkl')
    scaler_fertilizer = joblib.load('./models/scaler_fertilizer.pkl')
    encoder_crop = joblib.load('./models/encoder_crop.pkl')
    fertilizer_label_encoder = joblib.load(
        './models/fertilizer_label_encoder.pkl')
    soil_type_encoder = joblib.load('./models/soil_type_encoder.pkl')
    crop_type_encoder = joblib.load('./models/crop_type_encoder.pkl')
    print("Models loaded successfully")
except Exception as e:
    print(f"Error loading models: {e}")

# Crop mapping for fertilizer recommendation
crop_mapping = {
    'rice': 'rice',
    'maize': 'Maize',
    'chickpea': 'Pulses',
    'kidneybeans': 'kidneybeans',
    'pigeonpeas': 'Pulses',
    'mothbeans': 'Pulses',
    'mungbean': 'Pulses',
    'blackgram': 'Pulses',
    'lentil': 'Pulses',
    'pomegranate': 'pomegranate',
    'banana': 'pomegranate',
    'mango': 'pomegranate',
    'grapes': 'pomegranate',
    'watermelon': 'watermelon',
    'muskmelon': 'watermelon',
    'apple': 'pomegranate',
    'orange': 'orange',
    'papaya': 'pomegranate',
    'coconut': 'Oil seeds',
    'cotton': 'Cotton',
    'jute': 'Cotton',
    'coffee': 'coffee'
}

# NPK recommendations and fertilizer compositions
crop_original_recommendations = {
    'rice': {'N': '100-120 kg/ha', 'P': '40-50 kg/ha', 'K': '40-60 kg/ha'},
    'maize': {'N': '120-150 kg/ha', 'P': '50-60 kg/ha', 'K': '30-40 kg/ha'},
    'chickpea': {'N': '20-30 kg/ha', 'P': '40-50 kg/ha', 'K': '20-30 kg/ha'},
    'kidneybeans': {'N': '25-30 kg/ha', 'P': '50-60 kg/ha', 'K': '30-40 kg/ha'},
    'pigeonpeas': {'N': '20-25 kg/ha', 'P': '40-50 kg/ha', 'K': '20-30 kg/ha'},
    'mothbeans': {'N': '15-20 kg/ha', 'P': '30-40 kg/ha', 'K': '15-20 kg/ha'},
    'mungbean': {'N': '20-25 kg/ha', 'P': '40-50 kg/ha', 'K': '20-30 kg/ha'},
    'blackgram': {'N': '15-20 kg/ha', 'P': '30-40 kg/ha', 'K': '15-20 kg/ha'},
    'lentil': {'N': '25-30 kg/ha', 'P': '40-50 kg/ha', 'K': '20-30 kg/ha'},
    'pomegranate': {'N': '70-80 kg/ha', 'P': '30-40 kg/ha', 'K': '50-60 kg/ha'},
    'banana': {'N': '150-180 kg/ha', 'P': '50-60 kg/ha', 'K': '150-200 kg/ha'},
    'mango': {'N': '90-100 kg/ha', 'P': '30-40 kg/ha', 'K': '80-100 kg/ha'},
    'grapes': {'N': '100-120 kg/ha', 'P': '30-40 kg/ha', 'K': '140-160 kg/ha'},
    'watermelon': {'N': '70-80 kg/ha', 'P': '30-40 kg/ha', 'K': '70-80 kg/ha'},
    'muskmelon': {'N': '70-80 kg/ha', 'P': '30-40 kg/ha', 'K': '70-80 kg/ha'},
    'apple': {'N': '70-80 kg/ha', 'P': '30-40 kg/ha', 'K': '50-60 kg/ha'},
    'orange': {'N': '80-90 kg/ha', 'P': '30-40 kg/ha', 'K': '60-70 kg/ha'},
    'papaya': {'N': '90-100 kg/ha', 'P': '30-40 kg/ha', 'K': '90-100 kg/ha'},
    'coconut': {'N': '90-100 kg/ha', 'P': '40-50 kg/ha', 'K': '100-120 kg/ha'},
    'cotton': {'N': '70-80 kg/ha', 'P': '30-40 kg/ha', 'K': '30-40 kg/ha'},
    'jute': {'N': '40-50 kg/ha', 'P': '20-30 kg/ha', 'K': '20-30 kg/ha'},
    'coffee': {'N': '100-120 kg/ha', 'P': '30-40 kg/ha', 'K': '70-80 kg/ha'}
}

fertilizer_npk_composition = {
    'Urea': {'N': 46, 'P': 0, 'K': 0},
    'TSP': {'N': 0, 'P': 46, 'K': 0},
    'Superphosphate': {'N': 0, 'P': 20, 'K': 0},
    'Potassium sulfate': {'N': 0, 'P': 0, 'K': 50},
    'Potassium chloride': {'N': 0, 'P': 0, 'K': 60},
    'DAP': {'N': 18, 'P': 46, 'K': 0},
    '28-28': {'N': 28, 'P': 28, 'K': 0},
    '20-20': {'N': 20, 'P': 20, 'K': 0},
    '17-17-17': {'N': 17, 'P': 17, 'K': 17},
    '15-15-15': {'N': 15, 'P': 15, 'K': 15},
    '14-35-14': {'N': 14, 'P': 35, 'K': 14},
    '14-14-14': {'N': 14, 'P': 14, 'K': 14},
    '10-26-26': {'N': 10, 'P': 26, 'K': 26},
    '10-10-10': {'N': 10, 'P': 10, 'K': 10}
}

# Efficiency factors for different soil types
soil_efficiency_factors = {
    'Sandy': {'N': 0.7, 'P': 0.5, 'K': 0.6},
    'Clayey': {'N': 1.2, 'P': 1.1, 'K': 1.3},
    'Red': {'N': 0.8, 'P': 0.7, 'K': 0.8},
    'Black': {'N': 1.0, 'P': 1.0, 'K': 1.1},
    'Loamy': {'N': 1.0, 'P': 1.0, 'K': 1.0},
    'Clay': {'N': 1.2, 'P': 1.1, 'K': 1.3},
    'Silt': {'N': 0.9, 'P': 0.8, 'K': 0.9},
    'Peaty': {'N': 1.3, 'P': 0.7, 'K': 0.8},
    'Chalky': {'N': 0.8, 'P': 1.2, 'K': 0.9}
}


def calculate_fertilizer(crop, soil_levels, fertilizer, soil_type):
    """Calculate fertilizer amount based on crop needs and soil conditions"""
    try:
        if crop not in crop_original_recommendations:
            return 100.0  # Default to 100 kg/ha if crop not found

        original_npk = crop_original_recommendations[crop]

        def parse_recommendation(value):
            value = value.replace("kg/ha", "").strip()
            if '-' in value:
                low, high = map(int, value.split('-'))
                return (low + high) / 2
            return int(value)

        # Get recommended NPK levels
        recommendation_N = parse_recommendation(
            original_npk.get('N', '50-100 kg/ha'))
        recommendation_P = parse_recommendation(
            original_npk.get('P', '30-50 kg/ha'))
        recommendation_K = parse_recommendation(
            original_npk.get('K', '30-50 kg/ha'))

        # Get fertilizer composition
        if fertilizer not in fertilizer_npk_composition:
            return 100.0  # Default amount if fertilizer not found

        fertilizer_npk = fertilizer_npk_composition[fertilizer]

        # Get soil efficiency factors
        if soil_type not in soil_efficiency_factors:
            efficiency = {'N': 1.0, 'P': 1.0, 'K': 1.0}  # Default factors
        else:
            efficiency = soil_efficiency_factors[soil_type]

        # Calculate adjusted recommendations based on efficiency
        adjusted_N = recommendation_N / efficiency.get('N', 1.0)
        adjusted_P = recommendation_P / efficiency.get('P', 1.0)
        adjusted_K = recommendation_K / efficiency.get('K', 1.0)

        # Calculate deficits based on soil levels
        soil_N = soil_levels.get('N', 0)
        soil_P = soil_levels.get('P', 0)
        soil_K = soil_levels.get('K', 0)

        deficit_N = max(adjusted_N - soil_N, 0)
        deficit_P = max(adjusted_P - soil_P, 0)
        deficit_K = max(adjusted_K - soil_K, 0)

        # Calculate needed fertilizer amounts
        fert_N = fertilizer_npk.get('N', 0)
        fert_P = fertilizer_npk.get('P', 0)
        fert_K = fertilizer_npk.get('K', 0)

        # Calculate kg/ha needed (amount = deficit * 100 / nutrient_percentage)
        amount_N = deficit_N * 100 / fert_N if fert_N > 0 else 0
        amount_P = deficit_P * 100 / fert_P if fert_P > 0 else 0
        amount_K = deficit_K * 100 / fert_K if fert_K > 0 else 0

        # Return highest amount needed (most limiting nutrient)
        return max(amount_N, amount_P, amount_K, 50.0)  # Minimum 50 kg/ha

    except Exception as e:
        print(f"Error in fertilizer calculation: {e}")
        return 100.0  # Default on error


def read_soil_sensor():
    """Read data from soil sensor with robust port detection"""
    try:
        print("Scanning for available serial ports...")
        import serial.tools.list_ports
        available_ports = list(serial.tools.list_ports.comports())

        if not available_ports:
            print("No ports found! Cannot connect to sensor.")
            return {'error': 'No serial ports found. Please connect your soil sensor device.'}

        print(f"Available ports: {[p.device for p in available_ports]}")

        # Try each port until one works (usually Arduino/sensor shows up as USB Serial)
        for port_info in available_ports:
            try:
                port = port_info.device
                print(f"Trying port: {port} ({port_info.description})")

                instrument = minimalmodbus.Instrument(
                    port, 1)  # port name, slave address
                instrument.serial.baudrate = 9600
                instrument.serial.bytesize = 8
                instrument.serial.parity = serial.PARITY_NONE
                instrument.serial.stopbits = 1
                instrument.serial.timeout = 1  # seconds
                instrument.mode = minimalmodbus.MODE_RTU

                # Simple test read to see if connection works
                print(f"Testing connection on {port}...")
                data = instrument.read_registers(0, 14)
                print(f"Connection successful! Data: {data}")

                return {
                    'Temperature': data[0] / 10.0,     # Temperature in °C
                    'Moisture': data[2] / 10.0,        # Moisture in %
                    'pH': data[4] / 10.0,              # pH value
                    'N': data[1] / 10.0,               # N in mg/kg
                    'P': data[5] / 10.0,               # P in mg/kg
                    'K': data[6] / 10.0                # K in mg/kg
                }
            except Exception as e:
                print(f"Failed on port {port}: {str(e)}")
                continue

        # If we get here, no ports worked
        print("Tried all ports, none worked. Sensor not detected or not compatible.")
        return {'error': 'Could not connect to soil sensor on any port. Please check if the sensor is properly connected and powered.'}

    except Exception as e:
        import traceback
        print(f"Error in sensor reading: {e}")
        print(traceback.format_exc())
        return {'error': f'Sensor detection error: {str(e)}'}


@app.route('/', methods=['GET'])
def home():
    """Return a simple status message for the root endpoint"""
    return jsonify({
        'status': 'online',
        'message': 'Agricultural Assistant API is running',
        'endpoints': {
            'read_sensor': '/read_sensor',
            'test_sensor': '/test_sensor',
            'list_ports': '/list_ports',
            'predict': '/predict'
        }
    })


@app.route('/read_sensor', methods=['GET'])
def get_sensor_data():
    sensor_data = read_soil_sensor()
    if 'error' in sensor_data:
        return jsonify({'success': False, 'error': sensor_data['error']})
    return jsonify({'success': True, 'data': sensor_data})


@app.route('/test_sensor', methods=['GET'])
def test_sensor_data():
    """Endpoint that provides sensor data with proper error indications"""
    try:
        print("Attempting to read real sensor data...")
        sensor_data = read_soil_sensor()

        if 'error' not in sensor_data:
            essential_params = ['N', 'P', 'K', 'Moisture']
            all_zero = all(sensor_data.get(param, 0) <
                           1 for param in essential_params)

            if all_zero:
                print("All sensor readings near zero - sensor likely not in soil")
                return jsonify({
                    'success': False,
                    'error': 'Sensor readings too low. Please ensure sensor is inserted in soil.'
                })

            # Then apply the smarter soil detection
            if not is_sensor_in_soil(sensor_data):
                print(f"Invalid soil readings detected: {sensor_data}")
                return jsonify({
                    'success': False,
                    'error': 'Sensor appears to be not inserted correctly into the soil. Please insert fully into soil.'
                })

            print("Successfully read real sensor data")
            return jsonify({'success': True, 'data': sensor_data, 'source': 'sensor'})
        else:
            print(f"Error reading sensor: {sensor_data['error']}")
            return jsonify({
                'success': False,
                'error': f"Sensor error: {sensor_data['error']}"
            })

    except Exception as e:
        print(f"Exception in sensor reading: {str(e)}")
        return jsonify({
            'success': False,
            'error': f"Failed to connect to sensor: {str(e)}"
        })


# Ports listing endpoint


@app.route('/list_ports', methods=['GET'])
def list_ports():
    """List all available serial ports for debugging"""
    try:
        import serial.tools.list_ports
        available_ports = list(serial.tools.list_ports.comports())
        port_list = [{"port": p.device, "description": p.description}
                     for p in available_ports]
        return jsonify({"success": True, "ports": port_list})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

# Rewritten predict route


@app.route('/predict', methods=['POST'])
def predict():
    print("Received prediction request")
    try:
        # Extract data from the form
        print("Form data:", request.form)

        # Convert form data to appropriate types
        N = float(request.form.get('N', 0))
        P = float(request.form.get('P', 0))
        K = float(request.form.get('K', 0))
        temperature = float(request.form.get('Temperature', 25))
        humidity = float(request.form.get('Humidity', 65))
        ph = float(request.form.get('pH', 6))
        rainfall = float(request.form.get('Rainfall', 75))
        moisture = float(request.form.get('Moisture', 40))
        soil_type = request.form.get('Soil Type', 'Loamy')

        print(f"Processed inputs: N={N}, P={P}, K={K}, temp={temperature}, humidity={humidity}, "
              f"pH={ph}, rainfall={rainfall}, moisture={moisture}, soil_type={soil_type}")

        # Create raw input array for crop prediction
        crop_input_raw = np.array(
            [[N, P, K, temperature, humidity, ph, rainfall]])

        # Scale the input for the crop model
        scaled_crop_input = scaler_crop.transform(crop_input_raw)

        # Use RF model to predict crop
        rf_crop_pred_label = rf_crop_model.predict(scaled_crop_input)[0]

        # Convert integer label to crop name string
        predicted_crop = encoder_crop.inverse_transform(
            [rf_crop_pred_label])[0]
        crop_lower = predicted_crop.lower()

        # Map to fertilizer crop categories
        mapped_crop = crop_mapping.get(crop_lower, crop_lower)

        # IMPORTANT: Match the exact 6 features that the fertilizer scaler expects
        fertilizer_input_raw = np.array([[
            N, P, K,
            temperature, humidity, moisture
        ]])

        # Scale only the 6 numeric features
        scaled_numeric_features = scaler_fertilizer.transform(
            fertilizer_input_raw)

        # For the final prediction with RF model
        soil_type_encoded = soil_type_encoder.transform([soil_type])[0]
        crop_type_encoded = crop_type_encoder.transform([mapped_crop])[0]

        # Model could expect different ordering - adjust based on your training code
        rf_fertilizer_input = np.column_stack((
            scaled_numeric_features,
            np.array([[soil_type_encoded, crop_type_encoded]])
        ))

        fertilizer_label = rf_fertilizer_model.predict(rf_fertilizer_input)[0]
        predicted_fertilizer = fertilizer_label_encoder.inverse_transform(
            [fertilizer_label])[0]

        # Calculate fertilizer amount
        soil_levels = {'N': N, 'P': P, 'K': K}
        try:
            amount = calculate_fertilizer(
                predicted_crop, soil_levels, predicted_fertilizer, soil_type)
            fertilizer_amount = f"Apply {amount:.2f} kg/ha of {predicted_fertilizer}"
        except Exception as e:
            print(f"Error calculating fertilizer amount: {e}")
            fertilizer_amount = f"Apply {predicted_fertilizer} at recommended rates for {predicted_crop}"

        print(
            f"Prediction results: Crop={predicted_crop}, Fertilizer={predicted_fertilizer}, Amount={fertilizer_amount}")

        # Return JSON response for mobile app
        return jsonify({
            'results': {
                'crop': predicted_crop,
                'fertilizer': predicted_fertilizer,
                'amount': fertilizer_amount
            }
        })

    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Prediction error: {e}")
        print(error_details)
        return jsonify({
            'success': False,
            'error': str(e),
            'results': {
                'crop': "Error in prediction",
                'fertilizer': "Unable to determine",
                'amount': f"Error: {str(e)}"
            }
        })


def is_sensor_in_soil(sensor_data):
    """
    Smart detection of whether sensor is in actual soil vs hands/air
    Uses multiple parameters for more accurate detection
    """
    moisture = sensor_data.get('Moisture', 0)
    ph = sensor_data.get('pH', 0)

    # Main indicators that the sensor is NOT in soil:

    # 1. pH below 3.0 is extremely rare in natural soils
    #    Human skin typically reads pH 0-2 on these sensors
    if ph < 3.0 and ph != 0:  # pH=0 might be a faulty reading we should ignore
        print(f"Non-soil pH detected: {ph}")
        return False

    # 2. Moisture pattern - hand contact typically shows 5-12%
    #    Well-inserted soil sensors usually read >15%
    if moisture < 15.0 and moisture > 0:  # Only if moisture is actually being read
        print(f"Low moisture detected: {moisture}%")
        return False

    return True


if __name__ == '__main__':
    print("Starting server on 0.0.0.0:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
