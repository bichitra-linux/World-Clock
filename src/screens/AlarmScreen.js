import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Alert, FlatList, AccessibilityInfo, Platform } from 'react-native';
import { Text, Portal, Modal } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

import { CyberpunkTheme } from '../theme/CyberpunkTheme';
import { NeonCard, CyberButton, CyberText, CyberInput } from '../components/CyberpunkUI';
import { StorageService } from '../utils/StorageService';
import { PerformanceOptimizer } from '../utils/PerformanceOptimizer';

const AlarmScreen = React.memo(() => {
  const [alarms, setAlarms] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [alarmLabel, setAlarmLabel] = useState('');
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

  // Accessibility setup
  useEffect(() => {
    const checkScreenReader = async () => {
      try {
        const enabled = await AccessibilityInfo.isScreenReaderEnabled();
        setIsScreenReaderEnabled(enabled);
      } catch (error) {
        console.log('AccessibilityInfo not available');
      }
    };
    
    checkScreenReader();
    
    const subscription = AccessibilityInfo?.addEventListener?.(
      'screenReaderChanged',
      setIsScreenReaderEnabled
    );
    
    return () => {
      if (subscription?.remove) {
        subscription.remove();
      } else if (typeof subscription === 'function') {
        subscription();
      }
    };
  }, []);

  useEffect(() => {
    loadAlarms();
    const interval = setInterval(checkAlarms, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadAlarms = async () => {
    try {
      const savedAlarms = await StorageService.getItem('alarms');
      if (savedAlarms) {
        setAlarms(savedAlarms);
      }
    } catch (error) {
      console.error('Error loading alarms:', error);
    }
  };

  const saveAlarms = async (updatedAlarms) => {
    try {
      await StorageService.setItem('alarms', updatedAlarms);
      setAlarms(updatedAlarms);
    } catch (error) {
      console.error('Error saving alarms:', error);
    }
  };

  const checkAlarms = useCallback(() => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    alarms.forEach((alarm) => {
      if (alarm.enabled && alarm.time === currentTime && !alarm.triggered) {
        triggerAlarm(alarm);
      }
    });
  }, [alarms]);

  const triggerAlarm = async (alarm) => {
    try {
      // Haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Update alarm as triggered
      const updatedAlarms = alarms.map(a => 
        a.id === alarm.id ? { ...a, triggered: true } : a
      );
      saveAlarms(updatedAlarms);

      // Show alert
      Alert.alert(
        '⏰ ALARM',
        alarm.label || `Alarm at ${alarm.time}`,
        [
          {
            text: 'Snooze (5 min)',
            onPress: () => snoozeAlarm(alarm),
            style: 'default'
          },
          {
            text: 'Dismiss',
            onPress: () => dismissAlarm(alarm),
            style: 'cancel'
          }
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error triggering alarm:', error);
    }
  };

  const snoozeAlarm = (alarm) => {
    const snoozeTime = new Date();
    snoozeTime.setMinutes(snoozeTime.getMinutes() + 5);
    const newTime = `${snoozeTime.getHours().toString().padStart(2, '0')}:${snoozeTime.getMinutes().toString().padStart(2, '0')}`;
    
    const updatedAlarms = alarms.map(a => 
      a.id === alarm.id 
        ? { ...a, time: newTime, triggered: false, snoozed: true }
        : a
    );
    saveAlarms(updatedAlarms);
  };

  const dismissAlarm = (alarm) => {
    const updatedAlarms = alarms.map(a => 
      a.id === alarm.id ? { ...a, triggered: false } : a
    );
    saveAlarms(updatedAlarms);
  };

  const addAlarm = () => {
    const newAlarm = {
      id: Date.now().toString(),
      time: `${selectedTime.getHours().toString().padStart(2, '0')}:${selectedTime.getMinutes().toString().padStart(2, '0')}`,
      label: alarmLabel || `Alarm ${alarms.length + 1}`,
      enabled: true,
      triggered: false,
      snoozed: false,
      created: new Date().toISOString(),
    };

    const updatedAlarms = [...alarms, newAlarm];
    saveAlarms(updatedAlarms);
    setShowAddModal(false);
    setAlarmLabel('');
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const toggleAlarm = (alarmId) => {
    const updatedAlarms = alarms.map(alarm => 
      alarm.id === alarmId 
        ? { ...alarm, enabled: !alarm.enabled, triggered: false }
        : alarm
    );
    saveAlarms(updatedAlarms);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const deleteAlarm = (alarmId) => {
    Alert.alert(
      'Delete Alarm',
      'Are you sure you want to delete this alarm?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedAlarms = alarms.filter(alarm => alarm.id !== alarmId);
            saveAlarms(updatedAlarms);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          }
        }
      ]
    );
  };

  const renderAlarm = ({ item: alarm }) => (
    <NeonCard 
      style={styles.alarmCard}
      glowColor={alarm.enabled ? CyberpunkTheme.colors.primary : CyberpunkTheme.colors.surfaceVariant}
    >
      <View style={styles.alarmContent}>
        <View style={styles.timeContainer}>
          <CyberText 
            variant="display" 
            style={[
              styles.timeText, 
              { 
                color: alarm.enabled ? CyberpunkTheme.colors.primary : CyberpunkTheme.colors.onSurface,
                opacity: alarm.enabled ? 1 : 0.5
              }
            ]}
            glow={alarm.enabled}
          >
            {alarm.time}
          </CyberText>
          {alarm.snoozed && (
            <CyberText variant="caption" style={styles.snoozeText}>
              SNOOZED
            </CyberText>
          )}
        </View>
        
        <View style={styles.alarmDetails}>
          <CyberText variant="title" style={styles.labelText}>
            {alarm.label}
          </CyberText>
          <CyberText variant="caption" style={styles.statusText}>
            {alarm.enabled ? 'ACTIVE' : 'DISABLED'}
          </CyberText>
        </View>

        <View style={styles.controls}>
          <NeonButton
            title={alarm.enabled ? 'ON' : 'OFF'}
            onPress={() => toggleAlarm(alarm.id)}
            variant={alarm.enabled ? 'primary' : 'secondary'}
            style={styles.toggleButton}
          />
          <NeonButton
            title="×"
            onPress={() => deleteAlarm(alarm.id)}
            variant="error"
            style={styles.deleteButton}
          />
        </View>
      </View>
    </NeonCard>
  );

  return (
    <LinearGradient
      colors={[CyberpunkTheme.colors.background, CyberpunkTheme.colors.surfaceVariant]}
      style={styles.container}
    >
      <View style={styles.header}>
        <CyberText variant="headline" glow style={styles.title}>
          ⏰ ALARMS
        </CyberText>
        <CyberText variant="body" style={styles.subtitle}>
          {alarms.length} alarm{alarms.length !== 1 ? 's' : ''} configured
        </CyberText>
      </View>

      {alarms.length === 0 ? (
        <Animatable.View animation="fadeIn" style={styles.emptyState}>
          <CyberText variant="title" style={styles.emptyText}>
            No alarms set
          </CyberText>
          <CyberText variant="body" style={styles.emptySubtext}>
            Tap + to create your first cyberpunk alarm
          </CyberText>
        </Animatable.View>
      ) : (
        <FlatList
          data={alarms}
          renderItem={renderAlarm}
          keyExtractor={(item) => item.id}
          style={styles.alarmsList}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: CyberpunkTheme.colors.primary }]}
        onPress={() => setShowAddModal(true)}
        color={CyberpunkTheme.colors.onPrimary}
      />

      <Portal>
        <Modal
          visible={showAddModal}
          onDismiss={() => setShowAddModal(false)}
          contentContainerStyle={styles.modal}
        >
          <NeonCard style={styles.modalCard}>
            <CyberText variant="title" glow style={styles.modalTitle}>
              NEW ALARM
            </CyberText>
            
            <View style={styles.timePickerContainer}>
              <NeonButton
                title={`${selectedTime.getHours().toString().padStart(2, '0')}:${selectedTime.getMinutes().toString().padStart(2, '0')}`}
                onPress={() => setShowTimePicker(true)}
                variant="secondary"
                style={styles.timePickerButton}
              />
            </View>

            <View style={styles.modalActions}>
              <NeonButton
                title="CANCEL"
                onPress={() => setShowAddModal(false)}
                variant="error"
                style={styles.modalButton}
              />
              <NeonButton
                title="ADD ALARM"
                onPress={addAlarm}
                variant="primary"
                style={styles.modalButton}
              />
            </View>
          </NeonCard>
        </Modal>
      </Portal>

      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={(event, time) => {
            setShowTimePicker(false);
            if (time) {
              setSelectedTime(time);
            }
          }}
        />
      )}
    </LinearGradient>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: CyberpunkTheme.spacing.lg,
    marginBottom: CyberpunkTheme.spacing.lg,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: CyberpunkTheme.spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: CyberpunkTheme.spacing.lg,
  },
  emptyText: {
    marginBottom: CyberpunkTheme.spacing.sm,
    opacity: 0.7,
  },
  emptySubtext: {
    opacity: 0.5,
    textAlign: 'center',
  },
  alarmsList: {
    flex: 1,
    paddingHorizontal: CyberpunkTheme.spacing.md,
  },
  alarmCard: {
    marginVertical: CyberpunkTheme.spacing.sm,
  },
  alarmContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer: {
    flex: 1,
  },
  timeText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  snoozeText: {
    color: CyberpunkTheme.colors.warning,
    fontWeight: 'bold',
  },
  alarmDetails: {
    flex: 2,
    paddingHorizontal: CyberpunkTheme.spacing.md,
  },
  labelText: {
    marginBottom: CyberpunkTheme.spacing.xs,
  },
  statusText: {
    opacity: 0.7,
  },
  controls: {
    flexDirection: 'row',
  },
  toggleButton: {
    marginRight: CyberpunkTheme.spacing.sm,
    paddingHorizontal: 16,
  },
  deleteButton: {
    paddingHorizontal: 12,
  },
  fab: {
    position: 'absolute',
    margin: CyberpunkTheme.spacing.lg,
    right: 0,
    bottom: 0,
    elevation: 12,
  },
  modal: {
    padding: CyberpunkTheme.spacing.lg,
  },
  modalCard: {
    padding: CyberpunkTheme.spacing.lg,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: CyberpunkTheme.spacing.lg,
  },
  timePickerContainer: {
    alignItems: 'center',
    marginBottom: CyberpunkTheme.spacing.lg,
  },
  timePickerButton: {
    paddingHorizontal: CyberpunkTheme.spacing.xl,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    flex: 0.4,
  },
});

export default AlarmScreen;