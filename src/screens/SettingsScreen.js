import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Switch as RNSwitch } from 'react-native';
import { Text, Portal, Modal } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

import { CyberpunkTheme } from '../theme/CyberpunkTheme';
import { NeonCard, NeonButton, CyberText, HoloDivider, CyberIcon } from '../components/CyberpunkUI';
import { StorageService } from '../utils/StorageService';

const SettingsScreen = ({ navigation, settings, onUpdateSettings }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(settings.notificationsEnabled || false);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled !== false);
  const [vibrationEnabled, setVibrationEnabled] = useState(settings.vibrationEnabled !== false);
  const [selectedTheme, setSelectedTheme] = useState(settings.theme || 'cyberpunk');
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showSoundModal, setShowSoundModal] = useState(false);
  const [selectedSoundTheme, setSelectedSoundTheme] = useState(settings.soundTheme || 'cyberpunk');
  const [brightness, setBrightness] = useState(settings.brightness || 100);
  const [animationSpeed, setAnimationSpeed] = useState(settings.animationSpeed || 'normal');

  const handleTimeFormatToggle = () => {
    const newSettings = {
      ...settings,
      is24Hour: !settings.is24Hour,
    };
    onUpdateSettings(newSettings);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleNotificationsToggle = async () => {
    const newEnabled = !notificationsEnabled;
    setNotificationsEnabled(newEnabled);
    
    const newSettings = {
      ...settings,
      notificationsEnabled: newEnabled,
    };
    onUpdateSettings(newSettings);
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (newEnabled) {
      Alert.alert(
        '🔔 NOTIFICATIONS ENABLED',
        'You will receive cyberpunk-style alerts for alarms and timers.',
        [{ text: 'ACKNOWLEDGED', style: 'default' }]
      );
    }
  };

  const handleSoundToggle = async () => {
    const newEnabled = !soundEnabled;
    setSoundEnabled(newEnabled);
    
    const newSettings = {
      ...settings,
      soundEnabled: newEnabled,
    };
    onUpdateSettings(newSettings);
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleVibrationToggle = async () => {
    const newEnabled = !vibrationEnabled;
    setVibrationEnabled(newEnabled);
    
    const newSettings = {
      ...settings,
      vibrationEnabled: newEnabled,
    };
    onUpdateSettings(newSettings);
    
    if (newEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  };

  const handleSortingToggle = () => {
    const newSettings = {
      ...settings,
      sortCitiesAlphabetically: !settings.sortCitiesAlphabetically,
    };
    onUpdateSettings(newSettings);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleThemeChange = (newTheme) => {
    setSelectedTheme(newTheme);
    const newSettings = {
      ...settings,
      theme: newTheme,
    };
    onUpdateSettings(newSettings);
    setShowThemeModal(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleSoundThemeChange = (newSoundTheme) => {
    setSelectedSoundTheme(newSoundTheme);
    const newSettings = {
      ...settings,
      soundTheme: newSoundTheme,
    };
    onUpdateSettings(newSettings);
    setShowSoundModal(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleAutoUpdateToggle = () => {
    const newSettings = {
      ...settings,
      autoUpdateEnabled: !settings.autoUpdateEnabled,
    };
    onUpdateSettings(newSettings);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  const navigateToVersionInfo = () => {
    navigation.navigate('VersionInfo');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const navigateToFAQ = () => {
    navigation.navigate('FAQ');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const resetAllSettings = () => {
    Alert.alert(
      '⚠️ RESET SETTINGS',
      'This will restore all settings to their default cyberpunk configuration. Are you sure?',
      [
        { text: 'CANCEL', style: 'cancel' },
        {
          text: 'RESET',
          style: 'destructive',
          onPress: async () => {
            const defaultSettings = {
              is24Hour: false,
              sortCitiesAlphabetically: false,
              autoUpdateEnabled: true,
              theme: 'cyberpunk',
              soundEnabled: true,
              vibrationEnabled: true,
              soundTheme: 'cyberpunk',
              brightness: 100,
              animationSpeed: 'normal',
              notificationsEnabled: false,
            };
            
            onUpdateSettings(defaultSettings);
            setNotificationsEnabled(false);
            setSoundEnabled(true);
            setVibrationEnabled(true);
            setSelectedTheme('cyberpunk');
            setSelectedSoundTheme('cyberpunk');
            setBrightness(100);
            setAnimationSpeed('normal');
            
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            Alert.alert('SUCCESS', 'All settings have been reset to defaults.');
          }
        }
      ]
    );
  };

  const CyberSwitch = ({ value, onValueChange }) => (
    <View style={styles.switchContainer}>
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ 
          false: CyberpunkTheme.colors.surfaceVariant, 
          true: CyberpunkTheme.colors.primary 
        }}
        thumbColor={value ? CyberpunkTheme.colors.onPrimary : CyberpunkTheme.colors.onSurface}
        style={styles.switch}
      />
    </View>
  );

  const SettingItem = ({ icon, title, description, rightComponent, onPress, glowColor }) => (
    <Animatable.View animation="fadeIn" duration={800}>
      <NeonCard 
        style={styles.settingItem} 
        glowColor={glowColor}
        onPress={onPress}
      >
        <View style={styles.settingContent}>
          <View style={styles.settingLeft}>
            <CyberIcon name={icon} size={24} color={CyberpunkTheme.colors.primary} />
            <View style={styles.settingText}>
              <CyberText variant="body" style={styles.settingTitle}>
                {title}
              </CyberText>
              <CyberText variant="caption" style={styles.settingDescription}>
                {description}
              </CyberText>
            </View>
          </View>
          <View style={styles.settingRight}>
            {rightComponent}
          </View>
        </View>
      </NeonCard>
    </Animatable.View>
  );

  return (
    <LinearGradient
      colors={[CyberpunkTheme.colors.background, CyberpunkTheme.colors.surfaceVariant]}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <CyberText variant="headline" glow style={styles.title}>
            ⚙️ CYBER SETTINGS
          </CyberText>
          <CyberText variant="body" style={styles.subtitle}>
            Configure your cyberpunk experience
          </CyberText>
        </View>

        {/* Time & Display Settings */}
        <View style={styles.section}>
          <CyberText variant="title" glow style={styles.sectionTitle}>
            TIME & DISPLAY
          </CyberText>
          
          <SettingItem
            icon="clock-outline"
            title="24-HOUR FORMAT"
            description={settings.is24Hour ? "Military time enabled" : "Standard time format"}
            rightComponent={
              <CyberSwitch
                value={settings.is24Hour}
                onValueChange={handleTimeFormatToggle}
              />
            }
            glowColor={settings.is24Hour ? CyberpunkTheme.colors.primary : null}
          />

          <SettingItem
            icon="sort-alphabetical-ascending"
            title="SORT CITIES"
            description={settings.sortCitiesAlphabetically ? "Alphabetical order" : "Custom arrangement"}
            rightComponent={
              <CyberSwitch
                value={settings.sortCitiesAlphabetically || false}
                onValueChange={handleSortingToggle}
              />
            }
            glowColor={settings.sortCitiesAlphabetically ? CyberpunkTheme.colors.info : null}
          />

          <SettingItem
            icon="refresh"
            title="AUTO-UPDATE"
            description={settings.autoUpdateEnabled !== false ? "Real-time clock sync" : "Manual refresh only"}
            rightComponent={
              <CyberSwitch
                value={settings.autoUpdateEnabled !== false}
                onValueChange={handleAutoUpdateToggle}
              />
            }
            glowColor={settings.autoUpdateEnabled !== false ? CyberpunkTheme.colors.success : null}
          />
        </View>

        {/* Audio & Haptics */}
        <View style={styles.section}>
          <CyberText variant="title" glow style={styles.sectionTitle}>
            AUDIO & HAPTICS
          </CyberText>
          
          <SettingItem
            icon="bell-outline"
            title="NOTIFICATIONS"
            description={notificationsEnabled ? "Cyber alerts enabled" : "Silent mode"}
            rightComponent={
              <CyberSwitch
                value={notificationsEnabled}
                onValueChange={handleNotificationsToggle}
              />
            }
            glowColor={notificationsEnabled ? CyberpunkTheme.colors.warning : null}
          />

          <SettingItem
            icon="volume-high"
            title="SOUND EFFECTS"
            description={soundEnabled ? "Audio feedback active" : "Muted experience"}
            rightComponent={
              <CyberSwitch
                value={soundEnabled}
                onValueChange={handleSoundToggle}
              />
            }
            glowColor={soundEnabled ? CyberpunkTheme.colors.primary : null}
          />

          <SettingItem
            icon="cellphone-vibrate"
            title="HAPTIC FEEDBACK"
            description={vibrationEnabled ? "Tactile responses on" : "No vibration"}
            rightComponent={
              <CyberSwitch
                value={vibrationEnabled}
                onValueChange={handleVibrationToggle}
              />
            }
            glowColor={vibrationEnabled ? CyberpunkTheme.colors.secondary : null}
          />

          <SettingItem
            icon="music-note"
            title="SOUND THEME"
            description={`${selectedSoundTheme.toUpperCase()} audio pack`}
            rightComponent={
              <CyberIcon name="chevron-right" size={20} />
            }
            onPress={() => setShowSoundModal(true)}
            glowColor={CyberpunkTheme.colors.info}
          />
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <CyberText variant="title" glow style={styles.sectionTitle}>
            VISUAL INTERFACE
          </CyberText>
          
          <SettingItem
            icon="palette-outline"
            title="THEME SELECTION"
            description={`${selectedTheme.toUpperCase()} visual mode`}
            rightComponent={
              <CyberIcon name="chevron-right" size={20} />
            }
            onPress={() => setShowThemeModal(true)}
            glowColor={CyberpunkTheme.colors.primary}
          />

          <SettingItem
            icon="brightness-6"
            title="BRIGHTNESS"
            description={`${brightness}% interface intensity`}
            rightComponent={
              <CyberText variant="caption" style={styles.brightnessValue}>
                {brightness}%
              </CyberText>
            }
          />

          <SettingItem
            icon="animation-outline"
            title="ANIMATION SPEED"
            description={`${animationSpeed.toUpperCase()} motion effects`}
            rightComponent={
              <CyberText variant="caption" style={styles.speedValue}>
                {animationSpeed.toUpperCase()}
              </CyberText>
            }
          />
        </View>

        {/* System Information */}
        <View style={styles.section}>
          <CyberText variant="title" glow style={styles.sectionTitle}>
            SYSTEM DATA
          </CyberText>
          
          <SettingItem
            icon="information-outline"
            title="VERSION INFO"
            description="Build details and changelog"
            rightComponent={
              <CyberIcon name="chevron-right" size={20} />
            }
            onPress={navigateToVersionInfo}
            glowColor={CyberpunkTheme.colors.info}
          />

          <SettingItem
            icon="help-circle-outline"
            title="HELP DATABASE"
            description="FAQ and troubleshooting"
            rightComponent={
              <CyberIcon name="chevron-right" size={20} />
            }
            onPress={navigateToFAQ}
            glowColor={CyberpunkTheme.colors.warning}
          />
        </View>

        {/* System Features */}
        <View style={styles.section}>
          <CyberText variant="title" glow style={styles.sectionTitle}>
            SYSTEM FEATURES
          </CyberText>
          
          <SettingItem
            icon="clock-fast"
            title="REAL-TIME ENGINE"
            description="Quantum-synchronized time updates"
            rightComponent={
              <CyberText variant="caption" style={styles.featureStatus}>
                ACTIVE
              </CyberText>
            }
          />

          <SettingItem
            icon="earth"
            title="GLOBAL DATABASE"
            description="100+ cities with DST support"
            rightComponent={
              <CyberText variant="caption" style={styles.featureStatus}>
                LOADED
              </CyberText>
            }
          />

          <SettingItem
            icon="swap-horizontal"
            title="TIME CONVERTER"
            description="Multi-zone calculation matrix"
            rightComponent={
              <CyberText variant="caption" style={styles.featureStatus}>
                ONLINE
              </CyberText>
            }
          />

          <SettingItem
            icon="magnify"
            title="NEURAL SEARCH"
            description="Advanced city recognition AI"
            rightComponent={
              <CyberText variant="caption" style={styles.featureStatus}>
                READY
              </CyberText>
            }
          />
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <CyberText variant="title" style={[styles.sectionTitle, { color: CyberpunkTheme.colors.error }]}>
            DANGER ZONE
          </CyberText>
          
          <NeonButton
            title="RESET ALL SETTINGS"
            onPress={resetAllSettings}
            variant="error"
            style={styles.resetButton}
          />
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Theme Selection Modal */}
      <Portal>
        <Modal
          visible={showThemeModal}
          onDismiss={() => setShowThemeModal(false)}
          contentContainerStyle={styles.modal}
        >
          <NeonCard style={styles.modalCard}>
            <CyberText variant="title" glow style={styles.modalTitle}>
              SELECT THEME
            </CyberText>
            
            <View style={styles.themeOptions}>
              {[
                { key: 'cyberpunk', name: 'CYBERPUNK', description: 'Neon-enhanced interface' },
                { key: 'dark', name: 'DARK MODE', description: 'Classic dark theme' },
                { key: 'light', name: 'LIGHT MODE', description: 'Standard bright theme' },
                { key: 'auto', name: 'AUTO ADAPT', description: 'System-based switching' },
              ].map((theme) => (
                <NeonButton
                  key={theme.key}
                  title={theme.name}
                  onPress={() => handleThemeChange(theme.key)}
                  variant={selectedTheme === theme.key ? 'primary' : 'secondary'}
                  style={styles.themeOption}
                />
              ))}
            </View>

            <NeonButton
              title="CANCEL"
              onPress={() => setShowThemeModal(false)}
              variant="error"
              style={styles.modalCancel}
            />
          </NeonCard>
        </Modal>
      </Portal>

      {/* Sound Theme Modal */}
      <Portal>
        <Modal
          visible={showSoundModal}
          onDismiss={() => setShowSoundModal(false)}
          contentContainerStyle={styles.modal}
        >
          <NeonCard style={styles.modalCard}>
            <CyberText variant="title" glow style={styles.modalTitle}>
              SOUND PACK
            </CyberText>
            
            <View style={styles.soundOptions}>
              {[
                { key: 'cyberpunk', name: 'CYBERPUNK', description: 'Futuristic synth sounds' },
                { key: 'classic', name: 'CLASSIC', description: 'Traditional beeps' },
                { key: 'minimal', name: 'MINIMAL', description: 'Subtle audio cues' },
                { key: 'retro', name: 'RETRO WAVE', description: '80s-inspired tones' },
              ].map((sound) => (
                <NeonButton
                  key={sound.key}
                  title={sound.name}
                  onPress={() => handleSoundThemeChange(sound.key)}
                  variant={selectedSoundTheme === sound.key ? 'primary' : 'secondary'}
                  style={styles.soundOption}
                />
              ))}
            </View>

            <NeonButton
              title="CANCEL"
              onPress={() => setShowSoundModal(false)}
              variant="error"
              style={styles.modalCancel}
            />
          </NeonCard>
        </Modal>
      </Portal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: CyberpunkTheme.spacing.lg,
    marginBottom: CyberpunkTheme.spacing.xl,
  },
  title: {
    fontSize: 28,
    marginBottom: CyberpunkTheme.spacing.sm,
  },
  subtitle: {
    opacity: 0.7,
    textAlign: 'center',
  },
  section: {
    marginBottom: CyberpunkTheme.spacing.xl,
    paddingHorizontal: CyberpunkTheme.spacing.lg,
  },
  sectionTitle: {
    marginBottom: CyberpunkTheme.spacing.lg,
    fontSize: 18,
  },
  settingItem: {
    marginBottom: CyberpunkTheme.spacing.md,
    padding: CyberpunkTheme.spacing.lg,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: CyberpunkTheme.spacing.md,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: CyberpunkTheme.spacing.xs,
  },
  settingDescription: {
    opacity: 0.7,
    fontSize: 13,
  },
  settingRight: {
    marginLeft: CyberpunkTheme.spacing.md,
  },
  switchContainer: {
    justifyContent: 'center',
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
  brightnessValue: {
    color: CyberpunkTheme.colors.primary,
    fontWeight: 'bold',
  },
  speedValue: {
    color: CyberpunkTheme.colors.secondary,
    fontWeight: 'bold',
  },
  featureStatus: {
    color: CyberpunkTheme.colors.success,
    fontWeight: 'bold',
    fontSize: 12,
  },
  resetButton: {
    marginTop: CyberpunkTheme.spacing.md,
  },
  bottomPadding: {
    height: CyberpunkTheme.spacing.xxl,
  },
  modal: {
    margin: CyberpunkTheme.spacing.lg,
  },
  modalCard: {
    padding: CyberpunkTheme.spacing.xl,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: CyberpunkTheme.spacing.xl,
    fontSize: 20,
  },
  themeOptions: {
    marginBottom: CyberpunkTheme.spacing.lg,
  },
  themeOption: {
    marginBottom: CyberpunkTheme.spacing.md,
  },
  soundOptions: {
    marginBottom: CyberpunkTheme.spacing.lg,
  },
  soundOption: {
    marginBottom: CyberpunkTheme.spacing.md,
  },
  modalCancel: {
    marginTop: CyberpunkTheme.spacing.md,
  },
});

export default SettingsScreen;