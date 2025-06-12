import React, { useState, useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar, StyleSheet, useColorScheme as useSystemColorScheme } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';

// Import the main screen
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen'; // Add this import
import { lightTheme, darkTheme } from './src/utils/theme';

const Tab = createBottomTabNavigator();

export default function App() {
  const systemColorScheme = useSystemColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  useEffect(() => {
    if (systemColorScheme) {
      setIsDarkMode(systemColorScheme === 'dark');
    }
  }, [systemColorScheme]);
  
  const navigationTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme : DefaultTheme).colors,
      primary: theme.primary,
      background: theme.background,
      card: theme.surface,
    },
  };
  
  return (
    <PaperProvider theme={{
      colors: {
        primary: theme.primary,
        accent: theme.secondary,
        background: theme.background,
        surface: theme.surface,
        text: theme.text,
      },
      dark: isDarkMode,
    }}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.background} 
      />
      <NavigationContainer theme={navigationTheme}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
              backgroundColor: theme.surface,
              borderTopColor: theme.border,
            },
            tabBarActiveTintColor: theme.primary,
            tabBarInactiveTintColor: theme.textSecondary,
          })}
        >
          <Tab.Screen 
            name="Home" 
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home" color={color} size={size} />
              ),
            }}
          >
            {(props) => <HomeScreen {...props} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}
          </Tab.Screen>
          
          <Tab.Screen 
            name="History" 
            component={HistoryScreen} // Use component prop instead of render function
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="history" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginTop: 20,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  }
});