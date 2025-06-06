// src/components/InteractiveSensorReadings.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../utils/theme';

export default function InteractiveSensorReadings({ data }) {
  // Define the missing functions and variables
  const getIcon = (key) => {
    const icons = {
      N: 'alpha-n-circle',
      P: 'alpha-p-circle',
      K: 'alpha-k-circle',
      pH: 'water',
      Moisture: 'water-percent',
      Temperature: 'thermometer',
      Humidity: 'water-percent',
      Rainfall: 'weather-rainy',
    };
    return icons[key] || 'help-circle';
  };

  const getUnit = (key) => {
    const units = {
      N: 'mg/kg',
      P: 'mg/kg',
      K: 'mg/kg',
      pH: '',
      Moisture: '%',
      Temperature: '°C',
      Humidity: '%',
      Rainfall: 'mm',
    };
    return units[key] || '';
  };
  
  // Define optimal ranges for parameters
  const ranges = {
    N: { min: 20, max: 100 },
    P: { min: 10, max: 50 },
    K: { min: 100, max: 300 },
    pH: { min: 6.0, max: 7.0 },
    Moisture: { min: 20, max: 60 }
  };

  // Function to determine if a reading is in the optimal range
  const getReadingStatus = (key, value) => {
    if (!ranges[key]) return 'normal';
    
    if (value < ranges[key].min) return 'low';
    if (value > ranges[key].max) return 'high';
    return 'optimal';
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensor Readings</Text>
      
      {Object.entries(data || {}).map(([key, value]) => {
        if (key === 'source') return null;
        
        const status = getReadingStatus(key, value);
        const barWidth = Math.min(100, Math.max(0, value)) / 100 * (Dimensions.get('window').width - 80);
        
        return (
          <View key={key} style={styles.readingContainer}>
            <View style={styles.readingHeader}>
              <MaterialCommunityIcons 
                name={getIcon(key)} 
                size={22} 
                color={colors.primary} 
              />
              <Text style={styles.readingLabel}>{key}</Text>
              <Text style={[
                styles.readingValue, 
                status === 'optimal' ? styles.optimal : 
                status === 'high' ? styles.high : 
                status === 'low' ? styles.low : {}
              ]}>
                {typeof value === 'number' ? value.toFixed(1) : value} {getUnit(key)}
              </Text>
            </View>
            
            <View style={styles.barBackground}>
              <Animated.View 
                style={[
                  styles.barFill, 
                  { width: barWidth },
                  status === 'optimal' ? styles.optimalBar : 
                  status === 'high' ? styles.highBar : 
                  status === 'low' ? styles.lowBar : {}
                ]} 
              />
            </View>
            
            {(key === 'N' || key === 'P' || key === 'K' || key === 'pH' || key === 'Moisture') && (
              <Text style={styles.rangeTip}>
                Optimal range: {ranges[key].min} - {ranges[key].max} {getUnit(key)}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  readingContainer: {
    marginBottom: 16,
  },
  readingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  readingLabel: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#555',
  },
  readingValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  barBackground: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  optimal: {
    color: colors.success,
  },
  high: {
    color: colors.warning,
  },
  low: {
    color: colors.danger,
  },
  optimalBar: {
    backgroundColor: colors.success,
  },
  highBar: {
    backgroundColor: colors.warning,
  },
  lowBar: {
    backgroundColor: colors.danger,
  },
  rangeTip: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  }
});