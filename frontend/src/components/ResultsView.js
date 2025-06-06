// src/components/ResultsView.js
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Title, Text, Divider } from 'react-native-paper';
import { colors } from '../utils/theme';

export default function ResultsView({ results }) {
  return (
    <Card style={styles.card}>
      <Card.Title title="Recommendations" />
      <Card.Content>
        <View style={styles.resultItem}>
          <Title style={styles.resultTitle}>Recommended Crop</Title>
          <Text style={styles.resultValue}>{results.crop}</Text>
          <Text style={styles.resultDescription}>
            Based on your soil analysis and environmental conditions
          </Text>
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.resultItem}>
          <Title style={styles.resultTitle}>Recommended Fertilizer</Title>
          <Text style={styles.resultValue}>{results.fertilizer}</Text>
          <Text style={styles.resultDescription}>
            Optimal for your soil and chosen crop
          </Text>
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.resultItem}>
          <Title style={styles.resultTitle}>Application Rate</Title>
          <Text style={styles.resultValue}>{results.amount}</Text>
          <Text style={styles.resultDescription}>
            Ensure proper distribution for best results
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    marginBottom: 16,
    elevation: 3,
    backgroundColor: 'white',
  },
  resultItem: {
    marginVertical: 15,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  resultValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: 10,
    textAlign: 'center',
  },
  resultDescription: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    opacity: 0.7,
  },
  divider: {
    marginVertical: 10,
    height: 1,
  },
});