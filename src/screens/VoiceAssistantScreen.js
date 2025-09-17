import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as Animatable from 'react-native-animatable';
import { CyberpunkTheme } from '../theme/CyberpunkTheme';
import { CyberText, NeonCard, CyberButton } from '../components/CyberpunkUI';
import { cyberVoiceAssistant } from '../services/CyberVoiceAssistant';
import { PerformanceOptimizer } from '../utils/PerformanceOptimizer';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

export default function VoiceAssistantScreen({ navigation, cities = [] }) {
  const [isListening, setIsListening] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const waveAnim1 = useRef(new Animated.Value(0)).current;
  const waveAnim2 = useRef(new Animated.Value(0)).current;
  const waveAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startAnimations();
    return () => {
      cyberVoiceAssistant.shutdown();
    };
  }, []);

  const startAnimations = () => {
    // Continuous pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Wave animations with staggered delays
    const waveAnimation = (anim, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    waveAnimation(waveAnim1, 0);
    waveAnimation(waveAnim2, 1000);
    waveAnimation(waveAnim3, 2000);
  };

  const toggleAssistant = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      if (!isActive) {
        setIsActive(true);
        cyberVoiceAssistant.initialize();
        setResponse('Neural networks activated. Voice assistant online.');
      } else {
        setIsActive(false);
        cyberVoiceAssistant.shutdown();
        setResponse('Voice assistant offline. Neural networks deactivated.');
        setIsListening(false);
      }
    } catch (error) {
      console.error('Error toggling assistant:', error);
      Alert.alert('Error', 'Failed to toggle voice assistant');
    }
  };

  const startListening = () => {
    if (!isActive) {
      Alert.alert('Assistant Offline', 'Please activate the voice assistant first');
      return;
    }

    setIsListening(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Simulate voice recognition (in a real app, you'd use speech-to-text)
    setTimeout(() => {
      setIsListening(false);
      showCommandOptions();
    }, 2000);
  };

  const showCommandOptions = () => {
    const commands = [
      { title: 'What time is it?', command: 'what time is it' },
      { title: 'Add city', command: 'add city' },
      { title: 'Show cities', command: 'show cities' },
      { title: 'Start timer', command: 'start timer' },
      { title: 'Set alarm', command: 'set alarm' },
      { title: 'Open settings', command: 'open settings' },
      { title: 'Help', command: 'help' },
    ];

    Alert.alert(
      'Voice Commands',
      'Select a command to execute:',
      [
        ...commands.map(cmd => ({
          text: cmd.title,
          onPress: () => executeCommand(cmd.command)
        })),
        { text: 'Cancel', style: 'cancel' }
      ],
      { cancelable: true }
    );
  };

  const executeCommand = (command) => {
    setIsProcessing(true);
    setLastCommand(command);
    
    const response = cyberVoiceAssistant.processCommand(
      command,
      navigation,
      {},
      cities
    );
    
    setResponse(response);
    setIsProcessing(false);
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const stopSpeaking = () => {
    cyberVoiceAssistant.stopSpeaking();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <LinearGradient
      colors={[
        CyberpunkTheme.colors.background,
        CyberpunkTheme.colors.surface,
        CyberpunkTheme.colors.background,
      ]}
      locations={[0, 0.5, 1]}
      style={styles.container}
    >
      {/* Header */}
      <Animatable.View animation="slideInDown" duration={800} style={styles.header}>
        <CyberText variant="title" style={styles.title} glowIntensity={0.8}>
          CYBER VOICE ASSISTANT
        </CyberText>
        <CyberText variant="subtitle" style={styles.subtitle}>
          Neural Interface v2.1
        </CyberText>
      </Animatable.View>

      {/* Main Assistant Interface */}
      <View style={styles.assistantContainer}>
        {/* Background Waves */}
        <Animated.View style={[
          styles.wave,
          styles.wave1,
          {
            opacity: waveAnim1,
            transform: [{ scale: waveAnim1 }]
          }
        ]} />
        <Animated.View style={[
          styles.wave,
          styles.wave2,
          {
            opacity: waveAnim2,
            transform: [{ scale: waveAnim2 }]
          }
        ]} />
        <Animated.View style={[
          styles.wave,
          styles.wave3,
          {
            opacity: waveAnim3,
            transform: [{ scale: waveAnim3 }]
          }
        ]} />

        {/* Central AI Core */}
        <Animated.View style={[
          styles.aiCore,
          {
            transform: [{ scale: pulseAnim }]
          }
        ]}>
          <TouchableOpacity
            style={[
              styles.coreButton,
              isActive && styles.coreButtonActive,
              isListening && styles.coreButtonListening
            ]}
            onPress={toggleAssistant}
            activeOpacity={0.8}
          >
            <Animated.View style={[
              styles.coreGlow,
              {
                opacity: glowAnim
              }
            ]} />
            
            <Icon
              name={isActive ? 'mic' : 'mic-off'}
              size={60}
              color={isActive ? CyberpunkTheme.colors.neonCyan : CyberpunkTheme.colors.textSecondary}
            />
            
            {isListening && (
              <Animatable.View
                animation="pulse"
                iterationCount="infinite"
                style={styles.listeningIndicator}
              />
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Status Text */}
        <CyberText variant="body" style={styles.statusText}>
          {isActive ? 'Neural Networks: ONLINE' : 'Neural Networks: OFFLINE'}
        </CyberText>

        {/* Control Buttons */}
        <View style={styles.controlsContainer}>
          <CyberButton
            onPress={startListening}
            disabled={!isActive}
            style={[styles.controlButton, !isActive && styles.disabledButton]}
            glowIntensity={isActive ? 0.6 : 0}
          >
            <Icon name="keyboard-voice" size={24} color={CyberpunkTheme.colors.neonCyan} />
            <CyberText variant="button" style={styles.buttonText}>
              Voice Command
            </CyberText>
          </CyberButton>

          <CyberButton
            onPress={stopSpeaking}
            style={styles.controlButton}
            variant="secondary"
            glowIntensity={0.4}
          >
            <Icon name="stop" size={24} color={CyberpunkTheme.colors.neonPink} />
            <CyberText variant="button" style={styles.buttonText}>
              Stop Speech
            </CyberText>
          </CyberButton>
        </View>
      </View>

      {/* Response Panel */}
      <NeonCard style={styles.responsePanel} glowIntensity={0.5}>
        <CyberText variant="subtitle" style={styles.responseTitle}>
          Last Command
        </CyberText>
        <CyberText variant="body" style={styles.commandText}>
          {lastCommand || 'No commands executed yet'}
        </CyberText>
        
        <CyberText variant="subtitle" style={[styles.responseTitle, { marginTop: 15 }]}>
          Assistant Response
        </CyberText>
        <CyberText variant="body" style={styles.responseText}>
          {response || 'Awaiting neural interface activation...'}
        </CyberText>
        
        {isProcessing && (
          <Animatable.View
            animation="pulse"
            iterationCount="infinite"
            style={styles.processingIndicator}
          >
            <Icon name="psychology" size={20} color={CyberpunkTheme.colors.neonCyan} />
            <CyberText variant="caption" style={styles.processingText}>
              Processing neural patterns...
            </CyberText>
          </Animatable.View>
        )}
      </NeonCard>

      {/* Help Section */}
      <View style={styles.helpSection}>
        <CyberText variant="caption" style={styles.helpText}>
          Tap the AI core to activate • Use voice commands to control time functions
        </CyberText>
        <CyberText variant="caption" style={styles.helpText}>
          Neural interface supports navigation, timers, alarms, and more
        </CyberText>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  assistantContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 20,
  },
  wave: {
    position: 'absolute',
    borderRadius: 200,
    borderWidth: 1,
  },
  wave1: {
    width: 200,
    height: 200,
    borderColor: CyberpunkTheme.colors.neonCyan,
  },
  wave2: {
    width: 250,
    height: 250,
    borderColor: CyberpunkTheme.colors.neonPink,
  },
  wave3: {
    width: 300,
    height: 300,
    borderColor: CyberpunkTheme.colors.accent,
  },
  aiCore: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  coreButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: CyberpunkTheme.colors.surface,
    borderWidth: 2,
    borderColor: CyberpunkTheme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...PerformanceOptimizer.optimizeStylesForPlatform({
      shadowColor: CyberpunkTheme.colors.neonCyan,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 5,
    }),
  },
  coreButtonActive: {
    borderColor: CyberpunkTheme.colors.neonCyan,
    backgroundColor: CyberpunkTheme.colors.background,
  },
  coreButtonListening: {
    borderColor: CyberpunkTheme.colors.neonPink,
  },
  coreGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: CyberpunkTheme.colors.neonCyan,
  },
  listeningIndicator: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: CyberpunkTheme.colors.neonPink,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  controlButton: {
    flex: 1,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 14,
  },
  responsePanel: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
  },
  responseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: CyberpunkTheme.colors.neonCyan,
  },
  commandText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: CyberpunkTheme.colors.textSecondary,
  },
  responseText: {
    fontSize: 14,
    lineHeight: 20,
  },
  processingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: CyberpunkTheme.colors.background,
    borderRadius: CyberpunkTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: CyberpunkTheme.colors.neonCyan,
  },
  processingText: {
    marginLeft: 10,
    color: CyberpunkTheme.colors.neonCyan,
  },
  helpSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  helpText: {
    textAlign: 'center',
    opacity: 0.7,
    marginVertical: 2,
    fontSize: 12,
  },
});