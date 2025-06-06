import React from 'react';
import { StyleSheet, Animated, TouchableWithoutFeedback, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function DarkModeToggle({ isDarkMode, onToggle, showLabel = false }) {
  // Animation values
  const switchAnim = React.useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;
  
  React.useEffect(() => {
    Animated.timing(switchAnim, {
      toValue: isDarkMode ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDarkMode, switchAnim]);
  
  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle();
  };
  
  const backgroundColorInterpolation = switchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0,0,0,0.08)', 'rgba(255,255,255,0.15)']
  });
  
  // Make sure toggle positions are exactly the same in both light and dark mode
  const translateX = switchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22] // Standardized position
  });

  return (
    <View style={styles.wrapper}>
      {showLabel && (
        <Text style={[
          styles.label, 
          isDarkMode ? styles.darkLabel : styles.lightLabel
        ]}>
          {isDarkMode ? "Dark" : "Light"}
        </Text>
      )}
      <TouchableWithoutFeedback onPress={handleToggle}>
        <Animated.View style={[styles.container, { backgroundColor: backgroundColorInterpolation }]}>
          <Animated.View style={[styles.switch, { transform: [{ translateX }] }]}>
            {isDarkMode ? (
              <MaterialCommunityIcons name="moon-waxing-crescent" size={18} color="#64d2ff" />
            ) : (
              <MaterialCommunityIcons name="white-balance-sunny" size={18} color="#ff9500" />
            )}
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginRight: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  lightLabel: {
    color: '#ff9500',
  },
  darkLabel: {
    color: '#64d2ff',
  },
  container: {
    width: 48,
    height: 26,
    borderRadius: 13,
    padding: 2,
  },
  switch: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2
  }
});