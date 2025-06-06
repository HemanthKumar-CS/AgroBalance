// src/screens/MainScreen.js
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar
} from 'react-native';
import {
  Text,
  Button,
} from 'react-native-paper';
import DarkModeToggle from '../components/DarkModeToggle';
import InteractiveSensorReadings from '../components/InteractiveSensorReadings';
import RecommendationCards from '../components/RecommendationCards';
import SensorControls from '../components/SensorControls';
import { lightTheme, darkTheme } from '../utils/theme';

export default function MainScreen({ isDarkMode, setIsDarkMode }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [sensorData, setSensorData] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  const steps = [
    { title: "Soil Sensor", component: SensorStep },
    { title: "Soil Properties", component: SoilPropertiesStep },
    { title: "Results", component: ResultsStep },
  ];
  
  const goNext = () => setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
  const goBack = () => setCurrentStep(Math.max(currentStep - 1, 0));
  
  // Handle when sensor data is received
  const handleSensorData = (data) => {
    setSensorData(data);
    setRecommendations(null); // Clear previous recommendations
    if (currentStep === 0) goNext();
  };

  // Handle when recommendation data is received
  const handleRecommendations = (data) => {
    setRecommendations(data);
    if (currentStep === 1) goNext();
  };

  // Handle loading state changes
  const handleLoadingChange = (loading) => {
    setIsLoading(loading);
  };

  // Handle errors
  const handleError = (errorMessage) => {
    setError(errorMessage);
  };
  
  function SensorStep({ onNext }) {
    return (
      <View style={styles.stepContainer}>
        <SensorControls 
          onSensorData={handleSensorData}
          onLoading={handleLoadingChange}
          onError={handleError}
          theme={theme}
          isDarkMode={isDarkMode}
        />
      </View>
    );
  }
  
  function SoilPropertiesStep({ onNext }) {
    return (
      <View style={styles.stepContainer}>
        {sensorData && (
          <InteractiveSensorReadings 
            data={sensorData}
            theme={theme}
          />
        )}
        <Button 
          mode="contained"
          style={styles.actionButton}
          onPress={() => {
            // In a real app, call your API here
            const mockResults = {
              crop: "Tomatoes",
              fertilizer: "NPK 10-20-10",
              amount: "Apply 5kg per 100 square meters"
            };
            handleRecommendations({ results: mockResults });
          }}
          loading={isLoading}
        >
          Get Recommendations
        </Button>
      </View>
    );
  }
  
  function ResultsStep() {
    return (
      <View style={styles.stepContainer}>
        {recommendations && (
          <RecommendationCards 
            results={recommendations.results}
            theme={theme}
          />
        )}
        <Button 
          mode="outlined"
          style={styles.secondaryButton}
          onPress={() => setCurrentStep(0)}
        >
          Start New Analysis
        </Button>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Agricultural Assistant</Text>
        <DarkModeToggle 
          isDarkMode={isDarkMode} 
          onToggle={setIsDarkMode} 
        />
      </View>
      
      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        {steps.map((_, index) => (
          <View 
            key={index}
            style={[
              styles.progressDot,
              currentStep >= index ? { backgroundColor: theme.primary } : { backgroundColor: theme.border }
            ]}
          />
        ))}
      </View>
      
      <View style={styles.stepTitleContainer}>
        <Text style={[styles.stepTitle, { color: theme.text }]}>{steps[currentStep].title}</Text>
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {React.createElement(steps[currentStep].component, {
          onNext: goNext,
          onBack: goBack
        })}
      </ScrollView>
      
      {currentStep > 0 && currentStep < steps.length - 1 && (
        <View style={styles.navigationButtons}>
          <Button 
            mode="outlined" 
            onPress={goBack}
            style={styles.navButton}
          >
            Back
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  stepTitleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff5252',
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  stepContainer: {
    width: '100%',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  navButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  actionButton: {
    marginTop: 16,
    paddingVertical: 6,
  },
  secondaryButton: {
    marginTop: 16,
  }
});