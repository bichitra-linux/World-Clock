import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, StyleSheet, Alert, AccessibilityInfo, Platform } from 'react-native';
import { Text, TextInput, Portal, Modal } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

import { CyberpunkTheme } from '../theme/CyberpunkTheme';
import { NeonCard, NeonButton, CyberText, CyberProgressBar, CyberButton, CyberInput } from '../components/CyberpunkUI';
import { PerformanceOptimizer } from '../utils/PerformanceOptimizer';

const TimerScreen = React.memo(() => {
  const [duration, setDuration] = useState(0); // in seconds
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showSetModal, setShowSetModal] = useState(false);
  const [inputMinutes, setInputMinutes] = useState('5');
  const [inputSeconds, setInputSeconds] = useState('0');
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  
  const intervalRef = useRef(null);
  const animationRef = useRef(null);
  const lastAnnouncedTime = useRef(0);

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

  // Timer tick effect with accessibility announcements
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          
          // Announce time remaining at intervals for screen readers
          if (isScreenReaderEnabled && newTime > 0) {
            const minutes = Math.floor(newTime / 60);
            const seconds = newTime % 60;
            
            // Announce every minute for long timers, every 10 seconds for short timers
            const shouldAnnounce = 
              (newTime > 60 && seconds === 0) || // Every minute
              (newTime <= 60 && newTime % 10 === 0) || // Every 10 seconds for last minute
              newTime <= 10; // Every second for last 10 seconds
            
            if (shouldAnnounce && newTime !== lastAnnouncedTime.current) {
              const timeString = minutes > 0 
                ? `${minutes} minute${minutes !== 1 ? 's' : ''} and ${seconds} second${seconds !== 1 ? 's' : ''} remaining`
                : `${seconds} second${seconds !== 1 ? 's' : ''} remaining`;
              
              AccessibilityInfo.announceForAccessibility(timeString);
              lastAnnouncedTime.current = newTime;
            }
          }
          
          if (newTime <= 0) {
            handleTimerComplete();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft, isScreenReaderEnabled]);

  const handleTimerComplete = useCallback(async () => {
    setIsRunning(false);
    setIsPaused(false);
    
    // Announce completion for screen readers
    if (isScreenReaderEnabled) {
      AccessibilityInfo.announceForAccessibility('Timer completed!');
    }
    
    // Haptic feedback with platform check
    if (Platform.OS !== 'web') {
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.log('Haptics not available');
      }
    }
    
    // Animate completion
    if (animationRef.current) {
      animationRef.current.flash(3000);
    }
    // Show accessible alert
    Alert.alert(
      '⏰ TIME\'S UP!',
      'Your cyberpunk timer has completed.',
      [
        { 
          text: 'Reset Timer', 
          onPress: () => handleReset(),
          ...PerformanceOptimizer.createAccessibilityProps(
            'Reset timer to original duration',
            'Double tap to reset the timer back to its original duration'
          )
        },
        { 
          text: 'Set New Timer', 
          onPress: () => setShowSetModal(true),
          ...PerformanceOptimizer.createAccessibilityProps(
            'Set new timer duration',
            'Double tap to open timer duration settings'
          )
        },
      ],
      {
        cancelable: false,
        // Accessibility props for the alert itself
        ...PerformanceOptimizer.createAccessibilityProps(
          'Timer completion alert',
          'Timer has finished running. Choose to reset or set a new timer.'
        )
      }
    );
  }, [isScreenReaderEnabled]);

  const handleStart = useCallback(() => {
    if (timeLeft === 0) {
      const message = 'Please set a timer duration first.';
      if (isScreenReaderEnabled) {
        AccessibilityInfo.announceForAccessibility(message);
      }
      Alert.alert('Set Timer', message, [
        { 
          text: 'OK',
          ...PerformanceOptimizer.createAccessibilityProps(
            'Acknowledge message',
            'Close this dialog'
          )
        }
      ]);
      return;
    }
    setIsRunning(true);
    setIsPaused(false);
    
    if (isScreenReaderEnabled) {
      AccessibilityInfo.announceForAccessibility('Timer started');
    }
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [timeLeft, isScreenReaderEnabled]);

  const handlePause = useCallback(() => {
    setIsRunning(false);
    setIsPaused(true);
    
    if (isScreenReaderEnabled) {
      AccessibilityInfo.announceForAccessibility('Timer paused');
    }
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [isScreenReaderEnabled]);

  const handleResume = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
    
    if (isScreenReaderEnabled) {
      AccessibilityInfo.announceForAccessibility('Timer resumed');
    }
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [isScreenReaderEnabled]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(duration);
    
    if (isScreenReaderEnabled) {
      const timeString = formatTime(duration);
      AccessibilityInfo.announceForAccessibility(`Timer reset to ${timeString}`);
    }
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  }, [duration, isScreenReaderEnabled]);

  const handleSetTimer = useCallback(() => {
    const minutes = parseInt(inputMinutes) || 0;
    const seconds = parseInt(inputSeconds) || 0;
    const totalSeconds = minutes * 60 + seconds;
    
    if (totalSeconds <= 0) {
      const message = 'Please enter a valid time.';
      if (isScreenReaderEnabled) {
        AccessibilityInfo.announceForAccessibility(message);
      }
      Alert.alert('Invalid Time', message, [
        { 
          text: 'OK',
          ...PerformanceOptimizer.createAccessibilityProps(
            'Acknowledge invalid time',
            'Close this dialog and try again'
          )
        }
      ]);
      return;
    }

    setDuration(totalSeconds);
    setTimeLeft(totalSeconds);
    setIsRunning(false);
    setIsPaused(false);
    setShowSetModal(false);
    
    if (isScreenReaderEnabled) {
      const timeString = formatTime(totalSeconds);
      AccessibilityInfo.announceForAccessibility(`Timer set to ${timeString}`);
    }
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [inputMinutes, inputSeconds, isScreenReaderEnabled]);

  // Optimized formatting function
  const formatTime = useMemo(() => 
    PerformanceOptimizer.memoize((seconds) => {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      
      if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    })
  , []);

  // Optimized progress calculation
  const getProgressPercentage = useMemo(() => {
    if (duration === 0) return 0;
    return ((duration - timeLeft) / duration) * 100;
  }, [duration, timeLeft]);

  // Optimized status functions
  const getStatusColor = useMemo(() => {
    if (timeLeft === 0) return CyberpunkTheme.colors.success;
    if (isRunning) return CyberpunkTheme.colors.primary;
    if (isPaused) return CyberpunkTheme.colors.warning;
    return CyberpunkTheme.colors.secondary;
  }, [timeLeft, isRunning, isPaused]);

  const getStatusText = useMemo(() => {
    if (timeLeft === 0) return 'COMPLETED';
    if (isRunning) return 'RUNNING';
    if (isPaused) return 'PAUSED';
    return 'READY';
  }, [timeLeft, isRunning, isPaused]);

  return (
    <LinearGradient
      colors={[CyberpunkTheme.colors.background, CyberpunkTheme.colors.surfaceVariant]}
      style={styles.container}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      <View 
        style={styles.header}
        accessible={true}
        accessibilityRole="header"
        accessibilityLabel="Timer screen header"
      >
        <CyberText 
          variant="headline" 
          glow 
          style={styles.title}
          accessibilityRole="heading"
          accessibilityLevel={1}
          accessibilityLabel="Timer"
        >
          ⏱️ TIMER
        </CyberText>
        <CyberText 
          variant="body" 
          style={[styles.status, { color: getStatusColor }]}
          accessibilityLabel={`Timer status: ${getStatusText}`}
          accessibilityHint="Current state of the timer"
        >
          {getStatusText}
        </CyberText>
      </View>

      <NeonCard 
        style={styles.timerCard} 
        glowColor={getStatusColor}
        accessible={true}
        accessibilityRole="timer"
        accessibilityLabel={`Timer display showing ${formatTime(timeLeft)}`}
        accessibilityValue={{
          now: timeLeft,
          min: 0,
          max: duration,
          text: `${formatTime(timeLeft)} remaining out of ${formatTime(duration)}`
        }}
      >
        <Animatable.View 
          ref={animationRef} 
          style={styles.timerContent}
          accessible={false}
          importantForAccessibility="no-hide-descendants"
        >
          <CyberText 
            variant="display" 
            style={[styles.timeDisplay, { color: getStatusColor }]}
            glow
            accessibilityRole="text"
            accessibilityLabel={`Time remaining: ${formatTime(timeLeft)}`}
            accessibilityHint="Main timer display"
          >
            {formatTime(timeLeft)}
          </CyberText>
          
          {duration > 0 && (
            <View 
              style={styles.progressContainer}
              accessible={true}
              accessibilityRole="progressbar"
              accessibilityLabel={`Timer progress: ${Math.round(getProgressPercentage)}% complete`}
              accessibilityValue={{
                now: getProgressPercentage,
                min: 0,
                max: 100,
                text: `${Math.round(getProgressPercentage)} percent complete`
              }}
            >
              <CyberProgressBar 
                progress={getProgressPercentage}
                color={getStatusColor}
                style={styles.progressBar}
                accessible={false}
              />
              <CyberText 
                variant="caption" 
                style={styles.progressText}
                accessibilityElementsHidden={true}
              >
                {Math.round(getProgressPercentage)}% Complete
              </CyberText>
            </View>
          )}

          <CyberText 
            variant="title" 
            style={styles.durationText}
            accessibilityLabel={`Total timer duration: ${formatTime(duration)}`}
          >
            Duration: {formatTime(duration)}
          </CyberText>
        </Animatable.View>
      </NeonCard>

      <View 
        style={styles.controls}
        accessible={false}
        importantForAccessibility="no-hide-descendants"
      >
        <View 
          style={styles.topControls}
          accessibilityRole="group"
          accessibilityLabel="Timer control buttons"
        >
          <CyberButton
            title="SET TIMER"
            onPress={() => setShowSetModal(true)}
            variant="secondary"
            style={styles.controlButton}
            accessibilityLabel="Set timer duration"
            accessibilityHint="Opens dialog to set new timer duration in minutes and seconds"
            accessibilityRole="button"
          />
          <CyberButton
            title="RESET"
            onPress={handleReset}
            variant="warning"
            style={styles.controlButton}
            disabled={timeLeft === duration && !isRunning && !isPaused}
            accessibilityLabel="Reset timer"
            accessibilityHint="Resets timer back to original duration"
            accessibilityRole="button"
            accessibilityState={{ 
              disabled: timeLeft === duration && !isRunning && !isPaused 
            }}
          />
        </View>

        <View 
          style={styles.mainControls}
          accessibilityRole="group"
          accessibilityLabel="Primary timer controls"
        >
          {!isRunning && !isPaused && (
            <CyberButton
              title="START"
              onPress={handleStart}
              variant="primary"
              style={styles.mainButton}
              disabled={timeLeft === 0}
              accessibilityLabel="Start timer"
              accessibilityHint="Begins counting down the timer"
              accessibilityRole="button"
              accessibilityState={{ disabled: timeLeft === 0 }}
            />
          )}
          
          {isRunning && (
            <CyberButton
              title="PAUSE"
              onPress={handlePause}
              variant="warning"
              style={styles.mainButton}
              accessibilityLabel="Pause timer"
              accessibilityHint="Pauses the running timer"
              accessibilityRole="button"
            />
          )}
          
          {isPaused && (
            <CyberButton
              title="RESUME"
              onPress={handleResume}
              variant="primary"
              style={styles.mainButton}
              accessibilityLabel="Resume timer"
              accessibilityHint="Resumes the paused timer"
              accessibilityRole="button"
            />
          )}
        </View>
      </View>

      {/* Quick Timer Presets */}
      <View 
        style={styles.presets}
        accessible={false}
        importantForAccessibility="no-hide-descendants"
      >
        <CyberText 
          variant="body" 
          style={styles.presetsTitle}
          accessibilityRole="heading"
          accessibilityLevel={2}
          accessibilityLabel="Quick preset timers"
        >
          QUICK PRESETS
        </CyberText>
        <View 
          style={styles.presetButtons}
          accessibilityRole="group"
          accessibilityLabel="Preset timer durations"
        >
          {[
            { label: '1 MIN', seconds: 60 },
            { label: '5 MIN', seconds: 300 },
            { label: '10 MIN', seconds: 600 },
            { label: '25 MIN', seconds: 1500 },
          ].map((preset) => (
            <CyberButton
              key={preset.label}
              title={preset.label}
              onPress={() => {
                setDuration(preset.seconds);
                setTimeLeft(preset.seconds);
                setIsRunning(false);
                setIsPaused(false);
                
                if (isScreenReaderEnabled) {
                  AccessibilityInfo.announceForAccessibility(
                    `Timer set to ${preset.label.toLowerCase()}`
                  );
                }
                
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
              variant="info"
              style={styles.presetButton}
              accessibilityLabel={`Set timer to ${preset.label.toLowerCase()}`}
              accessibilityHint={`Quickly sets timer to ${preset.label.toLowerCase()}`}
              accessibilityRole="button"
            />
          ))}
        </View>
      </View>

      <Portal>
        <Modal
          visible={showSetModal}
          onDismiss={() => setShowSetModal(false)}
          contentContainerStyle={styles.modal}
          accessible={true}
          accessibilityLabel="Set timer duration dialog"
          accessibilityRole="dialog"
        >
          <NeonCard 
            style={styles.modalCard}
            accessible={false}
            importantForAccessibility="no-hide-descendants"
          >
            <CyberText 
              variant="title" 
              glow 
              style={styles.modalTitle}
              accessibilityRole="heading"
              accessibilityLevel={2}
              accessibilityLabel="Set timer duration"
            >
              SET TIMER
            </CyberText>
            
            <View 
              style={styles.inputContainer}
              accessible={false}
              importantForAccessibility="no-hide-descendants"
            >
              <View style={styles.timeInput}>
                <CyberInput
                  label="Minutes"
                  value={inputMinutes}
                  onChangeText={setInputMinutes}
                  keyboardType="numeric"
                  style={styles.input}
                  accessibilityLabel="Minutes input"
                  accessibilityHint="Enter number of minutes for the timer"
                  accessibilityRole="spinbutton"
                />
              </View>
              <CyberText 
                variant="title" 
                style={styles.separator}
                accessibilityElementsHidden={true}
              >
                :
              </CyberText>
              <View style={styles.timeInput}>
                <CyberInput
                  label="Seconds"
                  value={inputSeconds}
                  onChangeText={setInputSeconds}
                  keyboardType="numeric"
                  style={styles.input}
                  accessibilityLabel="Seconds input"
                  accessibilityHint="Enter number of seconds for the timer"
                  accessibilityRole="spinbutton"
                />
              </View>
            </View>

            <View 
              style={styles.modalActions}
              accessibilityRole="group"
              accessibilityLabel="Dialog actions"
            >
              <CyberButton
                title="CANCEL"
                onPress={() => setShowSetModal(false)}
                variant="error"
                style={styles.modalButton}
                accessibilityLabel="Cancel timer setup"
                accessibilityHint="Closes dialog without setting timer"
                accessibilityRole="button"
              />
              <CyberButton
                title="SET TIMER"
                onPress={handleSetTimer}
                variant="primary"
                style={styles.modalButton}
                accessibilityLabel="Confirm timer duration"
                accessibilityHint="Sets timer to the entered duration"
                accessibilityRole="button"
              />
            </View>
          </NeonCard>
        </Modal>
      </Portal>
    </LinearGradient>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.select({ ios: 60, android: 50, web: 40 }),
  },
  header: {
    alignItems: 'center',
    marginBottom: CyberpunkTheme.spacing.lg,
  },
  title: {
    fontSize: Platform.select({ ios: 32, android: 30, web: 28 }),
    marginBottom: CyberpunkTheme.spacing.sm,
  },
  status: {
    fontSize: Platform.select({ ios: 16, android: 15, web: 14 }),
    fontWeight: 'bold',
  },
  timerCard: {
    margin: CyberpunkTheme.spacing.lg,
    marginBottom: CyberpunkTheme.spacing.xl,
    ...PerformanceOptimizer.optimizeStylesForPlatform({
      shadowColor: CyberpunkTheme.colors.primary,
      shadowOpacity: 0.3,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 8,
    }),
  },
  timerContent: {
    alignItems: 'center',
    paddingVertical: CyberpunkTheme.spacing.lg,
  },
  timeDisplay: {
    fontSize: Platform.select({ ios: 48, android: 45, web: 42 }),
    fontWeight: 'bold',
    marginBottom: CyberpunkTheme.spacing.lg,
  },
  progressContainer: {
    width: '100%',
    marginBottom: CyberpunkTheme.spacing.lg,
  },
  progressBar: {
    height: Platform.select({ ios: 12, android: 10, web: 8 }),
    borderRadius: 6,
  },
  progressText: {
    textAlign: 'center',
    marginTop: CyberpunkTheme.spacing.sm,
    opacity: 0.7,
  },
  durationText: {
    opacity: 0.7,
  },
  controls: {
    paddingHorizontal: CyberpunkTheme.spacing.lg,
    marginBottom: CyberpunkTheme.spacing.lg,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: CyberpunkTheme.spacing.lg,
  },
  controlButton: {
    flex: 0.4,
    minHeight: Platform.select({ ios: 44, android: 48, web: 40 }),
  },
  mainControls: {
    alignItems: 'center',
  },
  mainButton: {
    paddingHorizontal: CyberpunkTheme.spacing.xxl,
    paddingVertical: CyberpunkTheme.spacing.md,
    minHeight: Platform.select({ ios: 56, android: 60, web: 52 }),
    minWidth: Platform.select({ ios: 120, android: 130, web: 110 }),
  },
  presets: {
    paddingHorizontal: CyberpunkTheme.spacing.lg,
  },
  presetsTitle: {
    textAlign: 'center',
    marginBottom: CyberpunkTheme.spacing.md,
    opacity: 0.7,
  },
  presetButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  presetButton: {
    marginHorizontal: CyberpunkTheme.spacing.xs,
    marginVertical: CyberpunkTheme.spacing.xs,
    paddingHorizontal: CyberpunkTheme.spacing.md,
    minHeight: Platform.select({ ios: 40, android: 42, web: 36 }),
    // Use width instead of flex for web compatibility
    ...Platform.select({
      web: { width: '22%' },
      default: {},
    }),
  },
  modal: {
    padding: CyberpunkTheme.spacing.lg,
    justifyContent: 'center',
    minHeight: Platform.select({ web: '50%', default: undefined }),
  },
  modalCard: {
    padding: CyberpunkTheme.spacing.lg,
    ...PerformanceOptimizer.optimizeStylesForPlatform({
      shadowColor: CyberpunkTheme.colors.primary,
      shadowOpacity: 0.5,
      shadowRadius: 15,
      shadowOffset: { width: 0, height: 8 },
      elevation: 12,
    }),
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: CyberpunkTheme.spacing.lg,
    fontSize: Platform.select({ ios: 24, android: 22, web: 20 }),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: CyberpunkTheme.spacing.lg,
  },
  timeInput: {
    flex: 1,
    marginHorizontal: CyberpunkTheme.spacing.sm,
  },
  input: {
    backgroundColor: CyberpunkTheme.colors.surface,
    minHeight: Platform.select({ ios: 56, android: 60, web: 48 }),
  },
  separator: {
    fontSize: Platform.select({ ios: 24, android: 22, web: 20 }),
    marginHorizontal: CyberpunkTheme.spacing.sm,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: CyberpunkTheme.spacing.md,
  },
  modalButton: {
    flex: 0.4,
    minHeight: Platform.select({ ios: 48, android: 52, web: 44 }),
  },
});

export default TimerScreen;