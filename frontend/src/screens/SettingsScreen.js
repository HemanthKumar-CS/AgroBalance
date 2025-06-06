import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { List } from 'react-native-paper';

const SettingsScreen = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <List.Section>
        <List.Item
          title="Dark Mode"
          description="Enable dark theme"
          left={props => <List.Icon {...props} icon="theme-light-dark" />}
          right={props => <Switch value={isDarkMode} onValueChange={setIsDarkMode} />}
        />
        <List.Item
          title="About"
          description="Learn more about this app"
          left={props => <List.Icon {...props} icon="information-outline" />}
        />
      </List.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default SettingsScreen;