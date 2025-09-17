import React, { memo } from 'react';
import { 
  View, 
  StyleSheet, 
  Alert, 
  TouchableOpacity,
  Platform,
  AccessibilityInfo,
} from 'react-native';
import * as Haptics from 'expo-haptics';

import { CyberpunkTheme } from '../theme/CyberpunkTheme';
import { NeonCard, CyberText, CyberIcon, CyberButton } from '../components/CyberpunkUI';
import { TimeService } from '../utils/TimeService';

const CityItem = memo(({ 
  city, 
  settings, 
  currentTime, 
  onRemove, 
  showDelete = true, 
  cyberpunk = false,
  accessibilityLabel,
  testID 
}) => {
  // Get current time information for the city
  const timeInfo = TimeService.getCurrentTimeForCity(city, settings.is24Hour);
  const timeDifference = TimeService.getTimeDifferenceFromLocal(city);

  const handleDelete = async () => {
    // Only provide haptic feedback if screen reader is not active
    const isScreenReaderEnabled = Platform.OS !== 'web' 
      ? await AccessibilityInfo.isScreenReaderEnabled() 
      : false;
      
    if (!isScreenReaderEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Alert.alert(
      'Remove City',
      `Remove ${city.name} from your world clock?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            if (!isScreenReaderEnabled) {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }
            onRemove(city);
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Helper function to get status color based on time difference
  const getStatusColor = () => {
    const hourDiff = Math.abs(parseFloat(timeDifference.split(' ')[0]) || 0);
    if (hourDiff === 0) return CyberpunkTheme.colors.success;
    if (hourDiff <= 6) return CyberpunkTheme.colors.primary;
    if (hourDiff <= 12) return CyberpunkTheme.colors.warning;
    return CyberpunkTheme.colors.secondary;
  };

  // Create comprehensive accessibility label
  const createAccessibilityLabel = () => {
    const timeFormatted = timeInfo.time;
    const period = timeInfo.period ? ` ${timeInfo.period}` : '';
    const difference = timeDifference !== 'Same time' ? `, ${timeDifference}` : ', same as local time';
    return `${city.name}, ${city.country}, current time ${timeFormatted}${period}${difference}`;
  };

  if (cyberpunk) {
    return (
      <NeonCard 
        style={styles.cyberpunkContainer} 
        glowColor={getStatusColor()}
        accessible={true}
        accessibilityRole="region"
        accessibilityLabel={accessibilityLabel || createAccessibilityLabel()}
        testID={testID}
      >
        <View style={styles.cyberpunkContent}>
          <View style={styles.leftSection}>
            <View style={styles.cityHeader}>
              <CyberText 
                variant="title" 
                style={styles.cyberpunkCityName} 
                glow
                accessible={true}
                accessibilityRole="header"
                accessibilityLabel={`City: ${city.name}`}
              >
                {city.name.toUpperCase()}
              </CyberText>
              <CyberText 
                variant="caption" 
                style={styles.cyberpunkCountry}
                accessible={true}
                accessibilityLabel={`Country: ${city.country}`}
              >
                {city.country.toUpperCase()}
              </CyberText>
            </View>
            
            <View 
              style={styles.infoRow}
              accessible={true}
              accessibilityLabel={`Date: ${timeInfo.date}`}
            >
              <CyberIcon 
                name="today" 
                size={16} 
                color={CyberpunkTheme.colors.textSecondary}
                accessible={false}
              />
              <CyberText variant="body" style={styles.cyberpunkDate}>
                {timeInfo.date}
              </CyberText>
            </View>
            
            <View 
              style={styles.infoRow}
              accessible={true}
              accessibilityLabel={`Time difference: ${timeDifference}`}
            >
              <CyberIcon 
                name="public" 
                size={16} 
                color={getStatusColor()}
                accessible={false}
              />
              <CyberText variant="caption" style={[styles.cyberpunkTimeDiff, { color: getStatusColor() }]}>
                {timeDifference}
              </CyberText>
            </View>
          </View>

          {/* Right side - Time and controls */}
          <View style={styles.rightSection}>
            <CyberText 
              variant="headline" 
              style={[styles.cyberpunkTime, { color: getStatusColor() }]} 
              glow
              accessible={true}
              accessibilityLabel={`Current time: ${timeInfo.time}${timeInfo.period ? ' ' + timeInfo.period : ''}`}
              accessibilityRole="text"
            >
              {timeInfo.time}
            </CyberText>
            
            {timeInfo.period && (
              <CyberText 
                variant="body" 
                style={styles.cyberpunkPeriod}
                accessible={false} // Included in main time accessibility label
              >
                {timeInfo.period}
              </CyberText>
            )}
            
            {showDelete && (
              <CyberButton
                style={styles.cyberpunkDeleteButton}
                onPress={handleDelete}
                variant="secondary"
                accessible={true}
                accessibilityLabel={`Remove ${city.name} from world clock`}
                accessibilityHint="Double tap to remove this city"
                accessibilityRole="button"
                testID={`delete-city-${city.timezone.replace('/', '-')}`}
              >
                <CyberIcon 
                  name="delete" 
                  size={18} 
                  color={CyberpunkTheme.colors.error}
                  accessible={false}
                />
              </CyberButton>
            )}
          </View>
        </View>

        {/* Status indicator */}
        <View 
          style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]}
          accessible={false}
        />
      </NeonCard>
    );
  }

  // Fallback to original design if not cyberpunk
  return (
    <View style={[styles.container, { borderBottomColor: '#E0E0E0' }]}>
      <View style={styles.listItem}>
        <View style={styles.originalContent}>
          <View style={styles.originalLeft}>
            <CyberText variant="body" style={styles.originalCityTitle}>
              {city.name}, {city.country}
            </CyberText>
            <View style={styles.originalDescription}>
              <CyberText variant="caption" style={styles.originalDate}>
                {timeInfo.date}
              </CyberText>
              <CyberText variant="caption" style={styles.originalTimeDiff}>
                {timeDifference}
              </CyberText>
            </View>
          </View>
          <View style={styles.originalRight}>
            <CyberText variant="title" style={styles.originalTime}>
              {timeInfo.time}
            </CyberText>
            {showDelete && (
              <TouchableOpacity onPress={handleDelete} style={styles.originalDeleteButton}>
                <CyberIcon name="delete" size={20} color={CyberpunkTheme.colors.error} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  // Cyberpunk styles
  cyberpunkContainer: {
    marginBottom: CyberpunkTheme.spacing.md,
    padding: CyberpunkTheme.spacing.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  cyberpunkContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
    marginRight: CyberpunkTheme.spacing.lg,
  },
  cityHeader: {
    marginBottom: CyberpunkTheme.spacing.sm,
  },
  cyberpunkCityName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: CyberpunkTheme.spacing.xs,
  },
  cyberpunkCountry: {
    opacity: 0.7,
    fontSize: 12,
    letterSpacing: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: CyberpunkTheme.spacing.xs,
  },
  cyberpunkDate: {
    marginLeft: CyberpunkTheme.spacing.sm,
    opacity: 0.8,
    fontSize: 14,
  },
  cyberpunkTimeDiff: {
    marginLeft: CyberpunkTheme.spacing.sm,
    fontWeight: 'bold',
    fontSize: 13,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  cyberpunkTime: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: CyberpunkTheme.spacing.sm,
  },
  cyberpunkDeleteButton: {
    padding: CyberpunkTheme.spacing.sm,
    borderRadius: CyberpunkTheme.borderRadius.sm,
    backgroundColor: CyberpunkTheme.colors.surface,
  },
  statusIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 4,
    height: '100%',
    opacity: 0.7,
  },
  
  // Original styles (fallback)
  container: {
    borderBottomWidth: 1,
  },
  listItem: {
    paddingVertical: CyberpunkTheme.spacing.md,
    paddingHorizontal: CyberpunkTheme.spacing.lg,
  },
  originalContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  originalLeft: {
    flex: 1,
  },
  originalCityTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  originalDescription: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  originalDate: {
    opacity: 0.7,
  },
  originalTimeDiff: {
    fontWeight: '500',
    color: CyberpunkTheme.colors.primary,
  },
  originalRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 100,
  },
  originalTime: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  originalDeleteButton: {
    padding: 4,
  },
});

export default CityItem;