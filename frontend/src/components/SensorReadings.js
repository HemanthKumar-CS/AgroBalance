import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { predictCrop } from '../api/apiService';
import { colors } from '../utils/theme';

const SensorReadings = ({ 
  data, 
  onRecommendations, 
  onLoading, 
  onError, 
  theme = colors, 
  isDarkMode = false 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  if (!data) return null;
  
  // Function to get icon for each reading
  const getIcon = (key) => {
    const icons = {
      N: "molecule",
      P: "molecule",
      K: "molecule",
      pH: "test-tube",
      Temperature: "thermometer",
      Moisture: "water-percent",
    };
    return icons[key] || "help-circle-outline";
  };

  // Function to get unit for each reading
  const getUnit = (key) => {
    const units = {
      N: "mg/kg",
      P: "mg/kg",
      K: "mg/kg",
      pH: "",
      Temperature: "°C",
      Moisture: "%",
    };
    return units[key] || "";
  };
  
  // Function to validate sensor data
  const validateSensorData = () => {
    // Check if data is marked as mock
    if (data.source === 'mock') {
      return {
        valid: false,
        message: 'Cannot analyze using mock data. Please connect a real sensor.'
      };
    }
    
    // Check if essential soil parameters are present and not too low
    const requiredParams = ['N', 'P', 'K', 'pH', 'Moisture'];
    const missingOrLow = requiredParams.filter(param => 
      !data[param] || parseFloat(data[param]) < 2
    );
    
    if (missingOrLow.length > 0) {
      return {
        valid: false,
        message: `Invalid sensor readings detected: ${missingOrLow.join(', ')} ${missingOrLow.length > 1 ? 'are' : 'is'} too low or missing. Please ensure the sensor is properly inserted in soil.`
      };
    }
    
    return { valid: true };
  };
  
  const handleAnalyze = async () => {
    // Validate sensor data before proceeding
    const validation = validateSensorData();
    if (!validation.valid) {
      onError(validation.message);
      Alert.alert(
        "Invalid Sensor Data",
        validation.message,
        [{ text: "OK" }]
      );
      return;
    }
    
    setIsAnalyzing(true);
    onLoading(true);
    
    try {
      // Call the API to get prediction
      const result = await predictCrop(data);
      console.log('Analysis result:', result);
      
      // Make sure we handle both possible response formats
      if (result && (result.results || result.crop)) {
        onRecommendations(result);
        onError(null);
      } else {
        throw new Error('Invalid prediction response format');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to analyze data';
      onError(errorMessage);
      console.error('Analysis error:', errorMessage);
    } finally {
      setIsAnalyzing(false);
      onLoading(false);
    }
  };

  return (
    <View style={[styles.container, {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 16,
    }]}>
      <Text style={[styles.title, {
        color: theme.text,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16
      }]}>Sensor Readings</Text>
      
      <View style={styles.readingsContainer}>
        {Object.entries(data).map(([key, value]) => {
          if (key === 'source') return null; // Don't display source property
          
          return (
            <View key={key} style={[styles.readingRow, {
              marginBottom: 14,
              paddingVertical: 2,
            }]}>
              <View style={[styles.iconWrapper, {
                width: 24,
                alignItems: 'center',
                marginRight: 8
              }]}>
                <MaterialCommunityIcons 
                  name={getIcon(key)} 
                  size={20} 
                  color={theme.primary} 
                />
              </View>
              <Text style={[styles.readingLabel, {
                color: theme.textSecondary,  // Improved contrast in dark mode
                width: 90,
                fontSize: 15
              }]}>{key}:</Text>
              <Text style={[styles.readingValue, {
                color: theme.text,
                fontWeight: '500',
                fontSize: 15
              }]}>
                {typeof value === 'number' ? value.toFixed(1) : value} {getUnit(key)}
              </Text>
            </View>
          );
        })}
      </View>
      
      <TouchableOpacity 
        style={[styles.analyzeButton, {
          backgroundColor: theme.primary,
          padding: 14,
          borderRadius: 8,
          marginTop: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }]}
        onPress={handleAnalyze}
        disabled={isAnalyzing}
      >
        {isAnalyzing ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <>
            <MaterialCommunityIcons name="flask" size={18} color="#ffffff" />
            <Text style={{
              fontWeight: 'bold',
              marginLeft: 8,
              color: '#ffffff',  // Always white text on button
              fontSize: 15
            }}>Get Recommendations</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
  },
  readingsContainer: {
    marginBottom: 8,
  },
  readingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingVertical: 2,
  },
  iconWrapper: {
    width: 24,
    alignItems: 'center',
    marginRight: 4,
  },
  readingLabel: {
    fontSize: 15,
  },
  readingValue: {
    flex: 1,
    fontWeight: '500',
    fontSize: 15,
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 14,
  },
  buttonText: {
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#fff',
    fontSize: 15,
  },
});

export default SensorReadings;