// src/components/CropSelectionForm.js
import { StyleSheet, View } from 'react-native';
import { Button, Card, TextInput } from 'react-native-paper';

export default function CropSelectionForm({ formData, onChange, onSubmit, loading }) {
  return (
    <Card style={styles.card}>
      <Card.Title title="Crop Selection" />
      <Card.Content>
        <View style={styles.formGroup}>
          <TextInput
            label="Crop Type (optional)"
            value={formData['Crop Type']}
            onChangeText={(value) => onChange('Crop Type', value)}
            mode="outlined"
            style={styles.input}
            placeholder="Leave empty for crop recommendation"
          />
        </View>
        
        <Button 
          mode="contained" 
          onPress={onSubmit}
          disabled={loading}
          loading={loading}
          style={styles.submitButton}
          icon="leaf"
        >
          Get Recommendations
        </Button>
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
  submitButton: {
    marginTop: 10,
    paddingVertical: 6,
  }
});