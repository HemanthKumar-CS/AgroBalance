import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../utils/theme';

const RecommendationView = ({ 
  recommendations, 
  theme = colors, 
  isDarkMode = false 
}) => {
  if (!recommendations || !recommendations.results) {
    return (
      <View style={[styles.container, { 
        backgroundColor: theme.surface,
        padding: 16
      }]}>
        <Text style={[styles.errorText, { color: theme.danger }]}>
          No recommendation data available
        </Text>
      </View>
    );
  }

  const { crop, fertilizer, amount } = recommendations.results;

  return (
    <View style={[styles.container, { 
      backgroundColor: theme.surface,
      padding: 16,
      borderRadius: 12,
      marginBottom: 16
    }]}>
      <Text style={[styles.title, { 
        color: theme.text,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16
      }]}>Your Recommendations</Text>

      <View style={[styles.recommendationItem, {
        backgroundColor: theme.surfaceAlt,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16
      }]}>
        <View style={[styles.iconContainer, { 
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          width: 60,
          height: 60,
          borderRadius: 30,
          alignItems: 'center',
          justifyContent: 'center'
        }]}>
          <MaterialCommunityIcons 
            name="sprout" 
            size={32} 
            color="#4caf50" 
          />
        </View>
        <View style={[styles.contentContainer, {
          flex: 1,
          marginLeft: 16
        }]}>
          <Text style={[styles.itemTitle, { 
            color: theme.textSecondary,  // Improved contrast
            fontSize: 14,
            marginBottom: 4
          }]}>Recommended Crop</Text>
          <Text style={[styles.itemValue, { 
            color: theme.text,
            fontSize: 18,
            fontWeight: 'bold'
          }]}>{crop || 'Not available'}</Text>
        </View>
      </View>

      <View style={[styles.recommendationItem, {
        backgroundColor: theme.surfaceAlt,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16
      }]}>
        <View style={[styles.iconContainer, { 
          backgroundColor: 'rgba(255, 152, 0, 0.2)',
          width: 60,
          height: 60,
          borderRadius: 30,
          alignItems: 'center',
          justifyContent: 'center'
        }]}>
          <MaterialCommunityIcons 
            name="bottle-tonic" 
            size={32} 
            color="#ff9800" 
          />
        </View>
        <View style={[styles.contentContainer, {
          flex: 1,
          marginLeft: 16
        }]}>
          <Text style={[styles.itemTitle, { 
            color: theme.textSecondary,  // Improved contrast
            fontSize: 14,
            marginBottom: 4
          }]}>Recommended Fertilizer</Text>
          <Text style={[styles.itemValue, { 
            color: theme.text,
            fontSize: 18,
            fontWeight: 'bold'
          }]}>{fertilizer || 'Not available'}</Text>
        </View>
      </View>

      <View style={[styles.recommendationItem, {
        backgroundColor: theme.surfaceAlt,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 8
      }]}>
        <View style={[styles.iconContainer, { 
          backgroundColor: 'rgba(33, 150, 243, 0.2)',
          width: 60,
          height: 60,
          borderRadius: 30,
          alignItems: 'center',
          justifyContent: 'center'
        }]}>
          <MaterialCommunityIcons 
            name="information-outline" 
            size={32} 
            color="#2196f3" 
          />
        </View>
        <View style={[styles.contentContainer, {
          flex: 1,
          marginLeft: 16
        }]}>
          <Text style={[styles.itemTitle, { 
            color: theme.textSecondary,  // Improved contrast
            fontSize: 14,
            marginBottom: 4
          }]}>Application Guidelines</Text>
          <Text style={[styles.itemValue, { 
            color: theme.text,
            fontSize: 18,
            fontWeight: 'bold'
          }]}>{amount || 'Not available'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    marginLeft: 16,
  },
  itemTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  itemValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    textAlign: 'center',
    padding: 16,
  }
});

export default RecommendationView;