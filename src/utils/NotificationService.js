import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const NotificationService = {
  async requestPermissions() {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        throw new Error('Permission not granted for notifications');
      }

      // For Android, create notification channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('time-alerts', {
          name: 'Time Zone Alerts',
          importance: Notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#2196F3',
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  },

  async scheduleTimeAlert(city, time, message) {
    try {
      const permissionGranted = await this.requestPermissions();
      if (!permissionGranted) {
        throw new Error('Notification permission not granted');
      }

      // Parse the time string (HH:MM format)
      const [hours, minutes] = time.split(':').map(Number);
      
      // Create a date for today with the specified time
      const alertTime = new Date();
      alertTime.setHours(hours, minutes, 0, 0);
      
      // If the time has already passed today, schedule for tomorrow
      if (alertTime.getTime() <= Date.now()) {
        alertTime.setDate(alertTime.getDate() + 1);
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `Time Alert: ${city.name}`,
          body: message || `It's ${time} in ${city.name}, ${city.country}`,
          data: { 
            cityName: city.name,
            cityCountry: city.country,
            timezone: city.timezone,
            alertTime: time,
          },
        },
        trigger: {
          date: alertTime,
          repeats: false,
        },
        identifier: `time-alert-${city.timezone}-${time}`,
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling time alert:', error);
      throw error;
    }
  },

  async scheduleRecurringAlert(city, time, message, repeatDaily = true) {
    try {
      const permissionGranted = await this.requestPermissions();
      if (!permissionGranted) {
        throw new Error('Notification permission not granted');
      }

      const [hours, minutes] = time.split(':').map(Number);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `Daily Alert: ${city.name}`,
          body: message || `Daily reminder: It's ${time} in ${city.name}, ${city.country}`,
          data: { 
            cityName: city.name,
            cityCountry: city.country,
            timezone: city.timezone,
            alertTime: time,
            recurring: true,
          },
        },
        trigger: {
          hour: hours,
          minute: minutes,
          repeats: repeatDaily,
        },
        identifier: `daily-alert-${city.timezone}-${time}`,
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling recurring alert:', error);
      throw error;
    }
  },

  async cancelNotification(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
      throw error;
    }
  },

  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
      throw error;
    }
  },

  async getScheduledNotifications() {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  },

  async showInstantNotification(title, body, data = {}) {
    try {
      const permissionGranted = await this.requestPermissions();
      if (!permissionGranted) {
        throw new Error('Notification permission not granted');
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
        },
        trigger: null, // Show immediately
      });
    } catch (error) {
      console.error('Error showing instant notification:', error);
      throw error;
    }
  },

  // Notification listener setup
  addNotificationReceivedListener(listener) {
    return Notifications.addNotificationReceivedListener(listener);
  },

  addNotificationResponseReceivedListener(listener) {
    return Notifications.addNotificationResponseReceivedListener(listener);
  },
};