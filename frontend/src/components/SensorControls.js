// src/components/SensorControls.js
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, IconButton, Surface, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { readSensor } from '../api/apiService';
import { borderRadius, colors, shadows, spacing } from '../utils/theme';

// Update the component to accept theme and isDarkMode props
export default function SensorControls({ onSensorData, onLoading, onError, theme = colors, isDarkMode = false }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    // Your existing effect code that uses pulseAnim
    // For example:
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Return cleanup function if needed
    return () => {
      pulseAnim.stop();
    };
  }, [pulseAnim]); // Add pulseAnim to the dependency array

  const handleReadSensor = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    setStatus({type: 'loading', message: 'Reading sensor data...'});
    onLoading(true);
    
    try {
      const response = await readSensor();
      
      // First check if the API explicitly indicated a sensor error
      if (response.source === 'mock') {
        setStatus({
          type: 'error', 
          message: 'No physical sensor connected. Cannot read real data.'
        });
        onError('Please connect your soil sensor device and try again.');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }
      
      // Then check if values suggest sensor isn't in soil
      const essentialParams = ['N', 'P', 'K', 'Moisture'];
      const allZeroOrLow = essentialParams.every(param => 
        !response[param] || parseFloat(response[param]) < 2
      );
      
      if (allZeroOrLow) {
        setStatus({
          type: 'error', 
          message: 'Sensor readings too low - not inserted in soil'
        });
        onError('Sensor detected but readings are too low. Please insert sensor into soil.');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }
      
      // SUCCESS - We have valid data
      setStatus({type: 'success', message: 'Sensor data read successfully'});
      onSensorData(response);
      onError(null);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      const errorMessage = error.message || 'Failed to read sensor data';
      setStatus({type: 'error', message: errorMessage});
      onError(errorMessage);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
      onLoading(false);
    }
  };

  // In the return statement, ensure consistent styling regardless of theme
  return (
    <Card 
      style={[
        styles.card, 
        shadows.medium, 
        { 
          backgroundColor: theme.surface, 
          borderRadius: 12,
          marginBottom: 16,
          overflow: 'hidden'
        }
      ]}
    >
      <LinearGradient
        colors={[`${theme.primary}15`, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <View style={styles.titleRow}>
            <Surface style={[
              styles.iconContainer, 
              { backgroundColor: `${theme.primary}20` }  // Same opacity regardless of theme
            ]}>
              <IconButton
                icon="chip"
                size={24}
                iconColor={theme.primary}
              />
            </Surface>
            <View style={styles.titleContainer}>
              <Text style={[styles.cardTitle, { 
                color: theme.text,
                fontSize: 18,
                fontWeight: 'bold',
              }]}>Soil Sensor</Text>
              <Text style={[styles.cardSubtitle, { 
                color: theme.textSecondary,  // Use textSecondary instead of textLight for better visibility
                fontSize: 14
              }]}>
                Connect to your IoT soil sensor
              </Text>
            </View>
          </View>
        </View>
        
        <Card.Content style={styles.cardContent}>
          <Button 
            mode="contained" 
            icon={loading ? undefined : "connection"}
            onPress={handleReadSensor}
            disabled={loading}
            loading={loading}
            contentStyle={styles.buttonContent}
            labelStyle={[styles.buttonLabel, { color: '#ffffff' }]}  // Ensure white text on button
            style={[styles.button, { backgroundColor: theme.primary }]}
          >
            {loading ? 'Connecting...' : 'Connect & Read Sensor'}
          </Button>
          
          {status && (
            <Surface style={[
              styles.statusContainer,
              { 
                backgroundColor: isDarkMode ? 'rgba(40, 40, 40, 0.9)' : 'rgba(245, 245, 245, 0.9)',
                borderRadius: 8,
              },
              status.type === 'success' ? [styles.successStatus, { borderLeftColor: theme.success }] : 
              status.type === 'error' ? [styles.errorStatus, { borderLeftColor: theme.danger }] : 
              [styles.loadingStatus, { borderLeftColor: theme.info }]
            ]}>
              {status.type === 'loading' && (
                <ActivityIndicator size={16} color={theme.info} style={styles.statusIcon} />
              )}
              {status.type === 'success' && (
                <MaterialCommunityIcons name="check-circle" size={16} color={theme.success} style={styles.statusIcon} />
              )}
              {status.type === 'error' && (
                <MaterialCommunityIcons name="alert-circle" size={16} color={theme.danger} style={styles.statusIcon} />
              )}
              <Text style={[
                styles.statusText,
                { 
                  fontSize: 14,
                  fontWeight: '500',
                  flex: 1,
                  color: status.type === 'success' ? theme.success : 
                         status.type === 'error' ? theme.danger : 
                         theme.info
                }
              ]}>
                {status.message}
              </Text>
            </Surface>
          )}
        </Card.Content>
      </LinearGradient>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  cardGradient: {
    borderRadius: borderRadius.lg,
  },
  cardHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.12)',
  },
  titleContainer: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 2,
  },
  cardContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  button: {
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  statusContainer: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    margin: 0,
    width: 20,
    height: 20,
  },
  successStatus: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: colors.success,
  },
  errorStatus: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: colors.danger,
  },
  loadingStatus: {
    backgroundColor: 'rgba(90, 200, 250, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: colors.info,
  },
  statusText: {
    fontSize: 14,
    flex: 1,
  },
  successText: {
    color: colors.success,
  },
  errorText: {
    color: colors.danger,
  },
  loadingText: {
    color: colors.info,
  }
});