import AsyncStorage from '@react-native-async-storage/async-storage';

const CITIES_STORAGE_KEY = '@GlobalTime:cities';
const SETTINGS_STORAGE_KEY = '@GlobalTime:settings';

export const StorageService = {
  // City management
  async saveCities(cities) {
    try {
      await AsyncStorage.setItem(CITIES_STORAGE_KEY, JSON.stringify(cities));
    } catch (error) {
      console.error('Error saving cities:', error);
      throw error;
    }
  },

  async loadCities() {
    try {
      const cities = await AsyncStorage.getItem(CITIES_STORAGE_KEY);
      return cities ? JSON.parse(cities) : [];
    } catch (error) {
      console.error('Error loading cities:', error);
      return [];
    }
  },

  // Settings management
  async saveSettings(settings) {
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  },

  async loadSettings() {
    try {
      const settings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      return settings ? JSON.parse(settings) : { is24Hour: false };
    } catch (error) {
      console.error('Error loading settings:', error);
      return { is24Hour: false };
    }
  },
};