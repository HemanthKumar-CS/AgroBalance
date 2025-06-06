// src/components/EnvironmentalFactorsForm.js
import { StyleSheet, View } from 'react-native';
import { Card, TextInput } from 'react-native-paper';

export default function EnvironmentalFactorsForm({ formData, onChange }) {
  return (
    <Card style={styles.card}>
      <Card.Title title="Environmental Factors" />
      <Card.Content>
        <View style={styles.formGroup}>
          <TextInput
            label="Temperature (°C)"
            value={formData.Temperature}
            onChangeText={(value) => onChange('Temperature', value)}
            keyboardType="numeric"
            mode="outlined"
            style={[
              styles.input, 
              formData.sensor_used === 'true' ? styles.sensorData : null
            ]}
          />
        </View>

        <View style={styles.formGroup}>
          <TextInput
            label="Humidity (%)"
            value={formData.Humidity}
            onChangeText={(value) => onChange('Humidity', value)}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
          />
        </View>

        <View style={styles.formGroup}>
          <TextInput
            label="Rainfall (mm)"
            value={formData.Rainfall}
            onChangeText={(value) => onChange('Rainfall', value)}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
          />
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  formGroup: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'white',
  },
  sensorData: {
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
  },
});