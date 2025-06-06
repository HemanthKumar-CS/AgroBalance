// src/utils/animations.js
import { Animated, Easing } from 'react-native';

export const slideInRight = (value, duration = 300) => {
  value.setValue(300);
  return Animated.timing(value, {
    toValue: 0,
    duration,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  });
};

export const slideOutLeft = (value, duration = 300) => {
  return Animated.timing(value, {
    toValue: -300,
    duration,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  });
};

export const fadeIn = (value, duration = 300) => {
  value.setValue(0);
  return Animated.timing(value, {
    toValue: 1,
    duration,
    easing: Easing.inOut(Easing.ease),
    useNativeDriver: true,
  });
};