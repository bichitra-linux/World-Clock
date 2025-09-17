import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Portal, Modal, Divider } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

import { CyberpunkTheme } from '../theme/CyberpunkTheme';
import { NeonCard, NeonButton, CyberText, HoloDivider } from '../components/CyberpunkUI';

const StopwatchScreen = () => {
  const [time, setTime] = useState(0); // in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [laps, setLaps] = useState([]);
  const [showLapModal, setShowLapModal] = useState(false);
  
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);
  const animationRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now() - pausedTimeRef.current;
      }
      
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 10); // Update every 10ms for smooth animation
    } else {
      clearInterval(intervalRef.current);
      if (isPaused) {
        pausedTimeRef.current = time;
      }
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isPaused]);

  const handleStart = () => {
    if (time === 0) {
      startTimeRef.current = Date.now();
      pausedTimeRef.current = 0;
    } else {
      startTimeRef.current = Date.now() - pausedTimeRef.current;
    }
    
    setIsRunning(true);
    setIsPaused(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handlePause = () => {
    setIsRunning(false);
    setIsPaused(true);
    pausedTimeRef.current = time;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTime(0);
    setLaps([]);
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const handleLap = () => {
    if (!isRunning) return;

    const lapTime = time;
    const lapNumber = laps.length + 1;
    const prevLapTime = laps.length > 0 ? laps[laps.length - 1].totalTime : 0;
    const lapDifference = lapTime - prevLapTime;

    const newLap = {
      id: lapNumber,
      lapTime: lapDifference,
      totalTime: lapTime,
      timestamp: new Date(),
    };

    setLaps(prev => [...prev, newLap]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Animate lap recording
    if (animationRef.current) {
      animationRef.current.pulse(500);
    }
  };

  const formatTime = (milliseconds, showMilliseconds = true) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);

    if (hours > 0) {
      const base = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      return showMilliseconds ? `${base}.${ms.toString().padStart(2, '0')}` : base;
    }
    
    const base = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return showMilliseconds ? `${base}.${ms.toString().padStart(2, '0')}` : base;
  };

  const getStatusColor = () => {
    if (isRunning) return CyberpunkTheme.colors.primary;
    if (isPaused) return CyberpunkTheme.colors.warning;
    return CyberpunkTheme.colors.secondary;
  };

  const getStatusText = () => {
    if (isRunning) return 'RUNNING';
    if (isPaused) return 'PAUSED';
    return 'READY';
  };

  const clearLaps = () => {
    Alert.alert(
      'Clear Lap Times',
      'Are you sure you want to clear all lap times?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          onPress: () => {
            setLaps([]);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
        },
      ]
    );
  };

  const getBestLap = () => {
    if (laps.length === 0) return null;
    return laps.reduce((best, current) => 
      current.lapTime < best.lapTime ? current : best
    );
  };

  const getWorstLap = () => {
    if (laps.length === 0) return null;
    return laps.reduce((worst, current) => 
      current.lapTime > worst.lapTime ? current : worst
    );
  };

  const renderLapItem = ({ item, index }) => {
    const bestLap = getBestLap();
    const worstLap = getWorstLap();
    const isLongest = laps.length > 1 && worstLap && item.id === worstLap.id;
    const isShortest = laps.length > 1 && bestLap && item.id === bestLap.id;

    let lapColor = CyberpunkTheme.colors.onSurface;
    if (isShortest) lapColor = CyberpunkTheme.colors.success;
    if (isLongest) lapColor = CyberpunkTheme.colors.error;

    return (
      <View style={[styles.lapItem, { borderLeftColor: lapColor }]}>
        <View style={styles.lapNumber}>
          <CyberText variant="body" style={{ color: lapColor }}>
            LAP {item.id}
          </CyberText>
          {isShortest && (
            <CyberText variant="caption" style={styles.lapLabel}>
              BEST
            </CyberText>
          )}
          {isLongest && (
            <CyberText variant="caption" style={styles.lapLabel}>
              WORST
            </CyberText>
          )}
        </View>
        <View style={styles.lapTimes}>
          <CyberText variant="body" style={[styles.lapTime, { color: lapColor }]}>
            {formatTime(item.lapTime)}
          </CyberText>
          <CyberText variant="caption" style={styles.totalTime}>
            Total: {formatTime(item.totalTime)}
          </CyberText>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[CyberpunkTheme.colors.background, CyberpunkTheme.colors.surfaceVariant]}
      style={styles.container}
    >
      <View style={styles.header}>
        <CyberText variant="headline" glow style={styles.title}>
          ⏱️ STOPWATCH
        </CyberText>
        <CyberText variant="body" style={[styles.status, { color: getStatusColor() }]}>
          {getStatusText()}
        </CyberText>
      </View>

      <NeonCard style={styles.stopwatchCard} glowColor={getStatusColor()}>
        <Animatable.View ref={animationRef} style={styles.stopwatchContent}>
          <CyberText 
            variant="display" 
            style={[styles.timeDisplay, { color: getStatusColor() }]}
            glow
          >
            {formatTime(time)}
          </CyberText>
          
          {laps.length > 0 && (
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <CyberText variant="caption" style={styles.statLabel}>
                  LAPS
                </CyberText>
                <CyberText variant="body" style={styles.statValue}>
                  {laps.length}
                </CyberText>
              </View>
              <View style={styles.statItem}>
                <CyberText variant="caption" style={styles.statLabel}>
                  BEST LAP
                </CyberText>
                <CyberText variant="body" style={[styles.statValue, { color: CyberpunkTheme.colors.success }]}>
                  {getBestLap() ? formatTime(getBestLap().lapTime, false) : '--'}
                </CyberText>
              </View>
              <View style={styles.statItem}>
                <CyberText variant="caption" style={styles.statLabel}>
                  AVG LAP
                </CyberText>
                <CyberText variant="body" style={styles.statValue}>
                  {laps.length > 0 ? formatTime(time / laps.length, false) : '--'}
                </CyberText>
              </View>
            </View>
          )}
        </Animatable.View>
      </NeonCard>

      <View style={styles.controls}>
        <View style={styles.topControls}>
          <NeonButton
            title="LAP"
            onPress={handleLap}
            variant="info"
            style={styles.controlButton}
            disabled={!isRunning}
          />
          <NeonButton
            title="RESET"
            onPress={handleReset}
            variant="error"
            style={styles.controlButton}
            disabled={isRunning}
          />
        </View>

        <View style={styles.mainControls}>
          {!isRunning && !isPaused && (
            <NeonButton
              title="START"
              onPress={handleStart}
              variant="primary"
              style={styles.mainButton}
            />
          )}
          
          {isRunning && (
            <NeonButton
              title="PAUSE"
              onPress={handlePause}
              variant="warning"
              style={styles.mainButton}
            />
          )}
          
          {isPaused && (
            <View style={styles.pausedControls}>
              <NeonButton
                title="RESUME"
                onPress={handleStart}
                variant="primary"
                style={styles.pausedButton}
              />
            </View>
          )}
        </View>
      </View>

      {/* Lap Times Preview */}
      {laps.length > 0 && (
        <View style={styles.lapsPreview}>
          <View style={styles.lapsHeader}>
            <CyberText variant="title" style={styles.lapsTitle}>
              LAP TIMES ({laps.length})
            </CyberText>
            <View style={styles.lapsActions}>
              <NeonButton
                title="VIEW ALL"
                onPress={() => setShowLapModal(true)}
                variant="secondary"
                style={styles.lapsButton}
              />
              <NeonButton
                title="CLEAR"
                onPress={clearLaps}
                variant="error"
                style={styles.lapsButton}
              />
            </View>
          </View>
          
          {/* Show last 3 laps */}
          <View style={styles.recentLaps}>
            {laps.slice(-3).reverse().map((lap, index) => (
              <View key={lap.id} style={styles.recentLapItem}>
                <CyberText variant="caption" style={styles.recentLapNumber}>
                  LAP {lap.id}
                </CyberText>
                <CyberText variant="body" style={styles.recentLapTime}>
                  {formatTime(lap.lapTime, false)}
                </CyberText>
              </View>
            ))}
          </View>
        </View>
      )}

      <Portal>
        <Modal
          visible={showLapModal}
          onDismiss={() => setShowLapModal(false)}
          contentContainerStyle={styles.modal}
        >
          <NeonCard style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <CyberText variant="title" glow style={styles.modalTitle}>
                ALL LAP TIMES
              </CyberText>
              <NeonButton
                title="CLOSE"
                onPress={() => setShowLapModal(false)}
                variant="secondary"
                style={styles.closeButton}
              />
            </View>
            
            <FlatList
              data={[...laps].reverse()} // Show newest first
              renderItem={renderLapItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.lapsList}
              ItemSeparatorComponent={() => <HoloDivider style={styles.lapSeparator} />}
              showsVerticalScrollIndicator={false}
            />
            
            {laps.length > 0 && (
              <View style={styles.modalStats}>
                <HoloDivider style={styles.statsDivider} />
                <View style={styles.modalStatsGrid}>
                  <View style={styles.modalStatItem}>
                    <CyberText variant="caption">TOTAL TIME</CyberText>
                    <CyberText variant="body">{formatTime(time, false)}</CyberText>
                  </View>
                  <View style={styles.modalStatItem}>
                    <CyberText variant="caption">TOTAL LAPS</CyberText>
                    <CyberText variant="body">{laps.length}</CyberText>
                  </View>
                  <View style={styles.modalStatItem}>
                    <CyberText variant="caption">BEST LAP</CyberText>
                    <CyberText variant="body" style={{ color: CyberpunkTheme.colors.success }}>
                      {getBestLap() ? formatTime(getBestLap().lapTime, false) : '--'}
                    </CyberText>
                  </View>
                  <View style={styles.modalStatItem}>
                    <CyberText variant="caption">WORST LAP</CyberText>
                    <CyberText variant="body" style={{ color: CyberpunkTheme.colors.error }}>
                      {getWorstLap() ? formatTime(getWorstLap().lapTime, false) : '--'}
                    </CyberText>
                  </View>
                </View>
              </View>
            )}
          </NeonCard>
        </Modal>
      </Portal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: CyberpunkTheme.spacing.lg,
  },
  title: {
    fontSize: 32,
    marginBottom: CyberpunkTheme.spacing.sm,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stopwatchCard: {
    margin: CyberpunkTheme.spacing.lg,
    marginBottom: CyberpunkTheme.spacing.lg,
  },
  stopwatchContent: {
    alignItems: 'center',
    paddingVertical: CyberpunkTheme.spacing.lg,
  },
  timeDisplay: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: CyberpunkTheme.spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: CyberpunkTheme.spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    opacity: 0.7,
    marginBottom: CyberpunkTheme.spacing.xs,
  },
  statValue: {
    fontWeight: 'bold',
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
    flex: 0.35,
  },
  mainControls: {
    alignItems: 'center',
  },
  mainButton: {
    paddingHorizontal: CyberpunkTheme.spacing.xxl,
    paddingVertical: CyberpunkTheme.spacing.md,
  },
  pausedControls: {
    alignItems: 'center',
  },
  pausedButton: {
    paddingHorizontal: CyberpunkTheme.spacing.xl,
    paddingVertical: CyberpunkTheme.spacing.md,
  },
  lapsPreview: {
    paddingHorizontal: CyberpunkTheme.spacing.lg,
    marginBottom: CyberpunkTheme.spacing.lg,
  },
  lapsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: CyberpunkTheme.spacing.md,
  },
  lapsTitle: {
    opacity: 0.8,
  },
  lapsActions: {
    flexDirection: 'row',
  },
  lapsButton: {
    marginLeft: CyberpunkTheme.spacing.sm,
    paddingHorizontal: CyberpunkTheme.spacing.sm,
  },
  recentLaps: {
    backgroundColor: CyberpunkTheme.colors.surface,
    borderRadius: CyberpunkTheme.borderRadius.md,
    padding: CyberpunkTheme.spacing.sm,
  },
  recentLapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: CyberpunkTheme.spacing.xs,
  },
  recentLapNumber: {
    opacity: 0.7,
  },
  recentLapTime: {
    fontWeight: 'bold',
  },
  modal: {
    margin: CyberpunkTheme.spacing.lg,
    maxHeight: '80%',
  },
  modalCard: {
    padding: CyberpunkTheme.spacing.lg,
    maxHeight: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: CyberpunkTheme.spacing.lg,
  },
  modalTitle: {
    flex: 1,
  },
  closeButton: {
    paddingHorizontal: CyberpunkTheme.spacing.md,
  },
  lapsList: {
    maxHeight: 300,
  },
  lapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: CyberpunkTheme.spacing.sm,
    paddingHorizontal: CyberpunkTheme.spacing.md,
    borderLeftWidth: 3,
    borderRadius: CyberpunkTheme.borderRadius.sm,
  },
  lapNumber: {
    flex: 1,
  },
  lapLabel: {
    color: CyberpunkTheme.colors.primary,
    fontWeight: 'bold',
    marginTop: CyberpunkTheme.spacing.xs,
  },
  lapTimes: {
    alignItems: 'flex-end',
  },
  lapTime: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalTime: {
    opacity: 0.7,
    marginTop: CyberpunkTheme.spacing.xs,
  },
  lapSeparator: {
    marginVertical: CyberpunkTheme.spacing.xs,
  },
  modalStats: {
    marginTop: CyberpunkTheme.spacing.md,
  },
  statsDivider: {
    marginVertical: CyberpunkTheme.spacing.md,
  },
  modalStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  modalStatItem: {
    alignItems: 'center',
    minWidth: '45%',
    marginBottom: CyberpunkTheme.spacing.sm,
  },
});

export default StopwatchScreen;