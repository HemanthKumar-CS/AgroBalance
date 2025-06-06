// src/components/LoadingOverlay.js
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { colors } from '../utils/theme';

export default function LoadingOverlay() {
  const animation = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    
    return () => {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    };
  }, [animation]); // Add animation to the dependency array

  return (
    <Animated.View 
      style={[
        styles.overlay,
        {
          opacity: animation,
          transform: [
            {
              scale: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [1.1, 1],
              }),
            },
          ],
        }
      ]}
    >
      <View style={styles.content}>
        <ActivityIndicator size={32} color={colors.primary} style={styles.spinner} />
        <Text style={styles.text}>Analyzing soil & crop data...</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: '80%',
  },
  spinner: {
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.text,
  }
});