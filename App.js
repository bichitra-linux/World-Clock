import React, { useState, useEffect, useCallback } from 'react';
import { NavigationContainer, DefaultTheme as NavigationTheme } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from './src/screens/HomeScreen';
import AddCityScreen from './src/screens/AddCityScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TimeZoneConverter from './src/screens/TimeZoneConverter';
import TimerScreen from './src/screens/TimerScreen';
import StopwatchScreen from './src/screens/StopwatchScreen';
import AlarmScreen from './src/screens/AlarmScreen';
import VoiceAssistantScreen from './src/screens/VoiceAssistantScreen';
import VersionInfoScreen from './src/screens/VersionInfoScreen';
import FAQScreen from './src/screens/FAQScreen';
import { DEFAULT_CITIES, TimeService } from './src/utils/TimeService';
import { StorageService } from './src/utils/StorageService';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Custom navigation theme to avoid React Native Web warnings
const customNavigationTheme = {
  ...NavigationTheme,
  colors: {
    ...NavigationTheme.colors,
    primary: '#2196F3',
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#000000',
    border: '#E0E0E0',
  },
};

// Custom theme for React Native Paper
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2196F3',
    accent: '#03DAC6',
    background: '#FFFFFF',
    surface: '#FFFFFF',
  },
};

// Cross-platform screen options to avoid React Native Web warnings
const getScreenOptions = () => ({
  headerStyle: {
    backgroundColor: theme.colors.primary,
    // Completely override shadow styles for web
    ...(Platform.OS === 'web' ? {
      boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
      shadowColor: undefined,
      shadowOffset: undefined,
      shadowOpacity: undefined,
      shadowRadius: undefined,
      elevation: undefined,
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    }),
  },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  // Add web-specific card style interpolator to avoid internal React Navigation shadows
  ...(Platform.OS === 'web' && {
    cardStyleInterpolator: ({ current, layouts }) => ({
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
        // Override any shadow properties
        shadowColor: undefined,
        shadowOffset: undefined,
        shadowOpacity: undefined,
        shadowRadius: undefined,
        elevation: undefined,
        boxShadow: 'none',
      },
    }),
  }),
});

function MainTabNavigator({ cities, settings, currentTime, onRemoveCity }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'WorldClock') {
            iconName = focused ? 'clock' : 'clock-outline';
          } else if (route.name === 'Timer') {
            iconName = focused ? 'timer' : 'timer-outline';
          } else if (route.name === 'Stopwatch') {
            iconName = focused ? 'stop-circle' : 'stop-circle-outline';
          } else if (route.name === 'Alarm') {
            iconName = focused ? 'alarm' : 'alarm';
          } else if (route.name === 'VoiceAI') {
            iconName = focused ? 'microphone' : 'microphone-outline';
          } else if (route.name === 'Converter') {
            iconName = focused ? 'swap-horizontal' : 'swap-horizontal';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'cog' : 'cog-outline';
          }
          
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        ...getScreenOptions(),
      })}
    >
      <Tab.Screen 
        name="WorldClock" 
        options={{ 
          title: 'GlobalTime',
          tabBarLabel: 'Clock',
        }}
      >
        {(props) => (
          <HomeScreen
            {...props}
            cities={cities}
            settings={settings}
            currentTime={currentTime}
            onRemoveCity={onRemoveCity}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Timer"
        component={TimerScreen}
        options={{
          title: 'Cyber Timer',
          tabBarLabel: 'Timer',
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Stopwatch"
        component={StopwatchScreen}
        options={{
          title: 'Cyber Stopwatch',
          tabBarLabel: 'Stopwatch',
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Alarm"
        component={AlarmScreen}
        options={{
          title: 'Cyber Alarm',
          tabBarLabel: 'Alarm',
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="VoiceAI"
        options={{
          title: 'Cyber AI Assistant',
          tabBarLabel: 'AI Voice',
          headerShown: false,
        }}
      >
        {(props) => (
          <VoiceAssistantScreen
            {...props}
            cities={cities}
            settings={settings}
          />
        )}
      </Tab.Screen>
      
      <Tab.Screen
        name="Converter"
        options={{
          title: 'Time Converter',
          tabBarLabel: 'Convert',
        }}
      >
        {(props) => (
          <TimeZoneConverter
            {...props}
            settings={settings}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Settings"
        options={{ 
          title: 'Settings',
          tabBarLabel: 'Settings',
        }}
      >
        {(props) => (
          <SettingsStack {...props} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function SettingsStack({ settings, onUpdateSettings }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="SettingsMain" 
        options={{ 
          title: 'Settings',
          headerShown: false, // Hide header since tab navigator shows it
        }}
      >
        {(props) => (
          <SettingsScreen
            {...props}
            settings={settings}
            onUpdateSettings={onUpdateSettings}
          />
        )}
      </Stack.Screen>
      
      <Stack.Screen
        name="VersionInfo"
        component={VersionInfoScreen}
        options={{ title: 'Version Information' }}
      />

      <Stack.Screen
        name="FAQ"
        component={FAQScreen}
        options={{ title: 'FAQ & Help' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [cities, setCities] = useState([]);
  const [settings, setSettings] = useState({ 
    is24Hour: false,
    notificationsEnabled: false,
    sortCitiesAlphabetically: false,
    autoUpdateEnabled: true,
    theme: 'light',
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Web-specific CSS injection to suppress React Native Web warnings
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Suppress specific React Native Web warnings
      const originalWarn = console.warn;
      console.warn = (...args) => {
        const message = args[0];
        if (typeof message === 'string') {
          // Suppress shadow* and pointerEvents deprecation warnings from React Navigation
          if (message.includes('"shadow*" style props are deprecated') ||
              message.includes('props.pointerEvents is deprecated') ||
              message.includes('Unexpected text node')) {
            return; // Suppress these specific warnings
          }
        }
        originalWarn.apply(console, args);
      };

      // Inject CSS to handle any remaining styling issues
      const style = document.createElement('style');
      style.innerHTML = `
        /* Suppress pointer-events warnings by ensuring proper CSS */
        [data-pointerevents] {
          pointer-events: inherit !important;
        }
        /* Override any problematic shadow properties */
        .rn-shadow, [style*="shadow"] {
          box-shadow: inherit !important;
          -webkit-box-shadow: inherit !important;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        console.warn = originalWarn; // Restore original console.warn
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      };
    }
  }, []);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Real-time clock updates - single interval for the entire app
  useEffect(() => {
    let interval;
    
    if (settings.autoUpdateEnabled !== false) {
      interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [settings.autoUpdateEnabled]);

  const loadInitialData = async () => {
    try {
      const savedCities = await StorageService.loadCities();
      const savedSettings = await StorageService.loadSettings();
      
      // If no cities saved, use default cities
      if (savedCities.length === 0) {
        setCities(DEFAULT_CITIES);
        await StorageService.saveCities(DEFAULT_CITIES);
      } else {
        setCities(savedCities);
      }
      
      setSettings(prev => ({ ...prev, ...savedSettings }));
    } catch (error) {
      console.error('Error loading initial data:', error);
      setCities(DEFAULT_CITIES);
    }
  };

  const addCity = useCallback(async (newCity) => {
    const cityExists = cities.some(city => city.timezone === newCity.timezone);
    if (!cityExists) {
      let updatedCities = [...cities, newCity];
      
      // Sort alphabetically if setting is enabled
      if (settings.sortCitiesAlphabetically) {
        updatedCities = TimeService.getSortedCities(updatedCities, 'name');
      }
      
      setCities(updatedCities);
      await StorageService.saveCities(updatedCities);
    }
  }, [cities, settings.sortCitiesAlphabetically]);

  const removeCity = useCallback(async (cityToRemove) => {
    const updatedCities = cities.filter(city => city.timezone !== cityToRemove.timezone);
    setCities(updatedCities);
    await StorageService.saveCities(updatedCities);
  }, [cities]);

  const updateSettings = useCallback(async (newSettings) => {
    setSettings(newSettings);
    await StorageService.saveSettings(newSettings);
    
    // Re-sort cities if alphabetical sorting was toggled
    if (newSettings.sortCitiesAlphabetically !== settings.sortCitiesAlphabetically) {
      if (newSettings.sortCitiesAlphabetically) {
        const sortedCities = TimeService.getSortedCities(cities, 'name');
        setCities(sortedCities);
        await StorageService.saveCities(sortedCities);
      }
    }
  }, [settings, cities]);

  return (
    <PaperProvider 
      theme={theme}
      // Add custom settings to prevent pointerEvents warnings
      settings={{
        ...Platform.select({
          web: {
            rippleEffectEnabled: false, // Disable ripple effects that might use pointerEvents
          },
        }),
      }}
    >
      <NavigationContainer theme={customNavigationTheme}>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="Main"
          screenOptions={getScreenOptions()}
        >
          <Stack.Screen 
            name="Main" 
            options={{ headerShown: false }}
          >
            {(props) => (
              <MainTabNavigator
                {...props}
                cities={cities}
                settings={settings}
                currentTime={currentTime}
                onRemoveCity={removeCity}
                onUpdateSettings={updateSettings}
              />
            )}
          </Stack.Screen>
          
          <Stack.Screen
            name="AddCity"
            options={{ title: 'Add City' }}
          >
            {(props) => (
              <AddCityScreen
                {...props}
                onAddCity={addCity}
                existingCities={cities}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}