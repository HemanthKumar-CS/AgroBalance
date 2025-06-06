import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

const RecommendationCard = ({ recommendations }) => {
  // Handle empty or invalid recommendations
  if (!recommendations || typeof recommendations !== 'object') {
    return null;
  }

  // Extract data from recommendations
  const { results } = recommendations;
  
  if (!results) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No recommendations available</Text>
      </View>
    );
  }

  const { crop, fertilizer, amount } = results;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommendations</Text>
      
      {crop && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="sprout" size={24} color="#4caf50" />
            <Text style={styles.sectionTitle}>Ideal Crop</Text>
          </View>
          <Text style={styles.value}>{crop}</Text>
        </View>
      )}
      
      {fertilizer && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="flask" size={24} color="#ff9800" />
            <Text style={styles.sectionTitle}>Recommended Fertilizer</Text>
          </View>
          <Text style={styles.value}>{fertilizer}</Text>
        </View>
      )}
      
      {amount && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="information" size={24} color="#2196f3" />
            <Text style={styles.sectionTitle}>Application Instructions</Text>
          </View>
          <Text style={styles.value}>{amount}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#aaa',
    marginLeft: 8,
  },
  value: {
    fontSize: 16,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: '#ff5252',
    fontSize: 16,
  },
});

export default RecommendationCard;