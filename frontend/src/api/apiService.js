// AgriculturalAssistant/src/api/apiService.js
import axios from 'axios';

import { Platform } from "react-native";

const API_URL =
  Platform.OS === "web"
    ? "http://localhost:5000"
    : "http://192.168.x.x:5000";
export default API_URL;

// Validate sensor data before prediction
const validateSensorData = (data) => {
  const requiredParams = ['N', 'P', 'K', 'pH', 'Moisture', 'Temperature'];
  const invalid = requiredParams.filter(param => 
    !data[param] || 
    data[param] === 0 || 
    data[param] === '0'
  );
  
  return {
    valid: invalid.length === 0,
    missing: invalid
  };
};

// Read sensor data function with improved error handling
export const readSensor = async () => {
  console.log('⚡ Reading sensor data');
  
  try {
    const url = `${API_URL}/test_sensor`;
    console.log(`📡 Requesting from: ${url}`);
    
    const response = await axios.get(url, { timeout: 10000 });
    console.log('✅ Response:', response.data);
    
    // Check for explicit error reported by the API
    if (response.data && response.data.success === false) {
      throw new Error(response.data.error || 'API reported failure');
    }
    
    // Check if the API indicated this is mock data
    if (response.data && response.data.source === 'mock') {
      // Return the data but mark it as mock
      return {
        ...response.data.data,
        source: 'mock'
      };
    }
    
    return response.data.data;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error; // Don't automatically fall back to mock data
  }
};

// Predict function with improved error handling
export const predictCrop = async (sensorData) => {
  console.log('⚡ Submitting data for prediction:', sensorData);
  
  // Validate sensor data
  const validation = validateSensorData(sensorData);
  if (!validation.valid) {
    console.error('❌ Invalid sensor data:', validation.missing.join(', '));
    throw new Error(`Invalid sensor readings: ${validation.missing.join(', ')} ${validation.missing.length > 1 ? 'are' : 'is'} missing or zero`);
  }
  
  try {
    // Create FormData object for submission
    const formData = new FormData();
    
    // Add all sensor data fields
    Object.keys(sensorData).forEach(key => {
      formData.append(key, sensorData[key].toString());
    });
    
    // Add missing required fields with default values
    if (!sensorData.Humidity) formData.append('Humidity', '65');
    if (!sensorData.Rainfall) formData.append('Rainfall', '75');
    if (!formData.get('Soil Type')) formData.append('Soil Type', 'Loamy');
    
    // Debug log the form data
    console.log('📦 Form data being sent:', 
      Object.fromEntries(formData._parts || []));
    
    const response = await axios.post(`${API_URL}/predict`, formData, {
      timeout: 10000, // 10 second timeout
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('✅ Prediction response:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Prediction error details:', error.message);
    
    if (error.response) {
      console.error('❌ Response status:', error.response.status);
      console.error('❌ Response data:', error.response.data);
    }
    
    // No mock data fallback, just throw the error
    throw error;
  }
};
