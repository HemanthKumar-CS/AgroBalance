// src/components/SoilPropertiesForm.js
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Card, HelperText, Text, TextInput } from 'react-native-paper';

import { borderRadius, colors, spacing } from '../utils/theme';

export default function SoilPropertiesForm({ formData, onChange }) {
  const [open, setOpen] = React.useState(false);
  const [soilTypes, setSoilTypes] = React.useState([
    { label: 'Sandy', value: 'Sandy' },
    { label: 'Loamy', value: 'Loamy' },
    { label: 'Clay', value: 'Clay' },
    { label: 'Silt', value: 'Silt' },
    { label: 'Peaty', value: 'Peaty' },
    { label: 'Chalky', value: 'Chalky' },
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="soil" size={22} color={colors.primary} />
        <Text style={styles.title}>Soil Properties</Text>
      </View>

      <Card.Content style={styles.content}>
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <TextInput
              label="Nitrogen (N)"
              value={formData.N}
              onChangeText={(text) => onChange('N', text)}
              style={styles.input}
              keyboardType="numeric"
              mode="outlined"
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              right={<TextInput.Affix text="mg/kg" />}
            />
            <HelperText type="info">Ideal: 20-100 mg/kg</HelperText>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              label="Phosphorus (P)"
              value={formData.P}
              onChangeText={(text) => onChange('P', text)}
              style={styles.input}
              keyboardType="numeric"
              mode="outlined"
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              right={<TextInput.Affix text="mg/kg" />}
            />
            <HelperText type="info">Ideal: 10-50 mg/kg</HelperText>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <TextInput
              label="Potassium (K)"
              value={formData.K}
              onChangeText={(text) => onChange('K', text)}
              style={styles.input}
              keyboardType="numeric"
              mode="outlined"
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              right={<TextInput.Affix text="mg/kg" />}
            />
            <HelperText type="info">Ideal: 100-300 mg/kg</HelperText>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              label="pH Level"
              value={formData.pH}
              onChangeText={(text) => onChange('pH', text)}
              style={styles.input}
              keyboardType="numeric"
              mode="outlined"
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
            />
            <HelperText type="info">Ideal: 6.0-7.0</HelperText>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <TextInput
              label="Soil Moisture"
              value={formData.Moisture}
              onChangeText={(text) => onChange('Moisture', text)}
              style={styles.input}
              keyboardType="numeric"
              mode="outlined"
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              right={<TextInput.Affix text="%" />}
            />
            <HelperText type="info">Ideal: 20-60%</HelperText>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.dropdownLabel}>Soil Type:</Text>
            <DropDownPicker
              open={open}
              value={formData['Soil Type']}
              items={soilTypes}
              setOpen={setOpen}
              setValue={(callback) => {
                const value = callback(formData['Soil Type']);
                onChange('Soil Type', value);
              }}
              setItems={setSoilTypes}
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              dropDownContainerStyle={styles.dropdownContainer}
              listItemContainerStyle={styles.dropdownItem}
            />
          </View>
        </View>
      </Card.Content>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: spacing.sm,
    color: colors.text,
  },
  content: {
    paddingHorizontal: spacing.md,
  },
  row: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    fontSize: 14,
  },
  dropdownLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
  },
  dropdown: {
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    minHeight: 50,
    marginTop: 2,
  },
  dropdownText: {
    fontSize: 14,
    color: colors.text,
  },
  dropdownContainer: {
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    zIndex: 1000,
  },
  dropdownItem: {
    height: 45,
  },
});