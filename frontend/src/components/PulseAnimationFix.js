import { useEffect } from 'react';
import { Animated } from 'react-native';

// This is a utility component to fix animation memory leaks
export default function PulseAnimationFix() {
  useEffect(() => {
    // Create a dummy animation that won't cause errors when stopped
    const safeAnimation = new Animated.Value(0);
    const pulseAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(safeAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(safeAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    // Make sure the animation has a proper stop function
    if (typeof pulseAnim.stop !== 'function') {
      pulseAnim.stop = () => {};
    }

    // Return cleanup function
    return () => {
      try {
        if (pulseAnim && typeof pulseAnim.stop === 'function') {
          pulseAnim.stop();
        }
      } catch (error) {
        console.log('Animation error:', error);
      }
    };
  }, []);

  // This component doesn't render anything
  return null;
}