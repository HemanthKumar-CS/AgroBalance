// src/components/RecommendationCards.js
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const CARD_MARGIN = 10;

export default function RecommendationCards({ results, theme }) {
  const [activeCard, setActiveCard] = useState(0);

  // Pre-calculated styles for cards
  const activeCardStyle = { transform: [{ scale: 1 }] };
  const inactiveCardStyle = { transform: [{ scale: 0.95 }] };

  const cards = [
    {
      title: "Recommended Crop",
      value: results?.crop || "N/A",
      icon: "sprout",
      color: "#4caf50",
      details: "Based on your soil analysis and environmental conditions"
    },
    {
      title: "Recommended Fertilizer",
      value: results?.fertilizer || "N/A",
      icon: "bottle-tonic",
      color: "#ff9800",
      details: "Optimal for your soil and chosen crop"
    },
    {
      title: "Application Rate",
      value: results?.amount || "N/A",
      icon: "information-outline",
      color: "#2196f3",
      details: "Ensure proper distribution for best results"
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>Your Recommendations</Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_MARGIN * 2));
          setActiveCard(newIndex);
        }}
      >
        {cards.map((card, index) => (
          <Animated.View 
            key={index} 
            style={[
              styles.card,
              { backgroundColor: theme.surface },
              activeCard === index ? activeCardStyle : inactiveCardStyle
            ]}
          >
            <View style={[styles.iconContainer, { backgroundColor: `${card.color}20` }]}>
              <MaterialCommunityIcons name={card.icon} size={40} color={card.color} />
            </View>
            <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>{card.title}</Text>
            <Text style={[styles.cardValue, { color: theme.text }]}>{card.value}</Text>
            <Text style={[styles.cardDetails, { color: theme.textLight }]}>{card.details}</Text>
          </Animated.View>
        ))}
      </ScrollView>
      
      <View style={styles.pagination}>
        {cards.map((_, index) => (
          <View 
            key={index}
            style={[
              styles.paginationDot,
              activeCard === index ? { backgroundColor: theme.primary, width: 20 } : { backgroundColor: theme.border }
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 10,
  },
  card: {
    width: CARD_WIDTH,
    padding: 20,
    marginHorizontal: CARD_MARGIN,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cardDetails: {
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.8,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  paginationDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});