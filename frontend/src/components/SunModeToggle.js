import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { Switch, Text } from 'react-native-paper';

export default function SunModeToggle({ isOutdoorMode, onToggle }) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="weather-sunny" size={24} color={isOutdoorMode ? "#FFAB00" : "#9E9E9E"} />
      <Text style={[styles.label, isOutdoorMode && styles.activeLabel]}>Outdoor Mode</Text>
      <Switch
        value={isOutdoorMode}
        onValueChange={onToggle}
        color="#FFAB00"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  label: {
    marginHorizontal: 12,
    fontSize: 16,
    color: '#9E9E9E',
  },
  activeLabel: {
    color: '#FFAB00',
    fontWeight: 'bold',
  }
});