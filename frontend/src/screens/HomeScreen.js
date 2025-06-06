import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DarkModeToggle from '../components/DarkModeToggle';
import RecommendationView from '../components/RecommendationView';
import SensorControls from '../components/SensorControls';
import SensorReadings from '../components/SensorReadings';
import { darkTheme, lightTheme } from '../utils/theme';

const HomeScreen = ({ isDarkMode, setIsDarkMode }) => {
  const [sensorData, setSensorData] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Set theme based on dark mode
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  // Handle when sensor data is received
  const handleSensorData = (data) => {
    setSensorData(data);
    setRecommendations(null); // Clear previous recommendations
  };

  // Handle when recommendation data is received
  const handleRecommendations = (data) => {
    setRecommendations(data);
  };

  // Handle loading state changes
  const handleLoadingChange = (loading) => {
    setIsLoading(loading);
  };

  // Handle errors
  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Surface style={[
        styles.header, 
        { 
          backgroundColor: theme.surface, 
          elevation: 2,  // Consistent elevation regardless of theme
          borderRadius: 12,
          padding: 16,
          marginBottom: 16
        }
      ]}>
        <View style={styles.headerContent}>
          <MaterialCommunityIcons 
            name="leaf" 
            size={24} 
            color={theme.primary} 
            style={styles.headerIcon} 
          />
          <Text style={[styles.headerText, { 
            color: theme.text,
            fontSize: 20,
            fontWeight: 'bold',
            flex: 1
          }]}>
            Agricultural Assistant
          </Text>
          
          <DarkModeToggle 
            isDarkMode={isDarkMode} 
            onToggle={() => setIsDarkMode(!isDarkMode)}
            showLabel={false}
          />
        </View>
      </Surface>
      
      {isLoading && (
        <View style={[styles.loadingContainer, { backgroundColor: theme.surface }]}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.primary }]}>Processing...</Text>
        </View>
      )}
      
      {error && (
        <Surface style={[
          styles.errorContainer, 
          { backgroundColor: isDarkMode ? 'rgba(255, 69, 58, 0.15)' : 'rgba(244, 67, 54, 0.1)' }
        ]}>
          <MaterialCommunityIcons 
            name="alert-circle" 
            size={22} 
            color={theme.danger} 
            style={styles.errorIcon} 
          />
          <Text style={[styles.errorText, { color: theme.danger }]}>
            {error}
          </Text>
        </Surface>
      )}
      
      <SensorControls 
        onSensorData={handleSensorData}
        onLoading={handleLoadingChange}
        onError={handleError}
        theme={theme}
        isDarkMode={isDarkMode}
      />
      
      {sensorData && (
        <SensorReadings 
          data={sensorData}
          onRecommendations={handleRecommendations}
          onLoading={handleLoadingChange}
          onError={handleError}
          theme={theme}
          isDarkMode={isDarkMode}
        />
      )}
      
      {recommendations && (
        <RecommendationView 
          recommendations={recommendations} 
          theme={theme}
          isDarkMode={isDarkMode}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerIcon: {
    marginRight: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  errorContainer: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ff5252',
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    fontWeight: '500',
    flex: 1,
    fontSize: 14,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;