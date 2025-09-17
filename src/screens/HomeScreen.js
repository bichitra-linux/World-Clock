import React from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  RefreshControl, 
  Platform,
  AccessibilityInfo,
  Alert 
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

import { CyberpunkTheme } from '../theme/CyberpunkTheme';
import { NeonCard, CyberButton, CyberText, HoloDivider, CyberIcon } from '../components/CyberpunkUI';
import CityItem from '../components/CityItem';

const HomeScreen = ({ navigation, cities, settings, currentTime, onRemoveCity }) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [screenReaderEnabled, setScreenReaderEnabled] = React.useState(false);

  React.useEffect(() => {
    // Check if screen reader is enabled
    if (Platform.OS !== 'web') {
      AccessibilityInfo.isScreenReaderEnabled().then(setScreenReaderEnabled);
      const subscription = AccessibilityInfo.addEventListener('screenReaderChanged', setScreenReaderEnabled);
      return () => subscription?.remove?.() || subscription;
    }
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    
    // Provide haptic feedback only if screen reader is not enabled
    if (!screenReaderEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Announce refresh to screen readers
    if (Platform.OS !== 'web') {
      AccessibilityInfo.announceForAccessibility('Refreshing time data');
    }
    
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
      if (Platform.OS !== 'web') {
        AccessibilityInfo.announceForAccessibility('Time data refreshed');
      }
    }, 1000);
  }, [screenReaderEnabled]);

  const navigateToAddCity = async () => {
    if (!screenReaderEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    navigation.navigate('AddCity');
  };

  const handleRemoveCity = async (city) => {
    Alert.alert(
      'Remove City',
      `Are you sure you want to remove ${city.name} from your world clock?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            onRemoveCity(city);
            if (Platform.OS !== 'web') {
              AccessibilityInfo.announceForAccessibility(`${city.name} removed from world clock`);
            }
          },
        },
      ],
    );
  };

  if (cities.length === 0) {
    return (
      <LinearGradient
        colors={[CyberpunkTheme.colors.background, CyberpunkTheme.colors.surfaceVariant]}
        style={[styles.container, styles.emptyContainer]}
      >
        <Animatable.View 
          animation="fadeInUp" 
          duration={1200} 
          style={styles.emptyContent}
          accessible={true}
          accessibilityRole="region"
          accessibilityLabel="No cities added to world clock"
        >
          <CyberIcon 
            name="public-off" 
            size={80} 
            color={CyberpunkTheme.colors.primary} 
            style={styles.emptyIcon}
            accessible={true}
            accessibilityLabel="World icon indicating no cities"
          />
          <CyberText 
            variant="headline" 
            glow 
            style={styles.emptyTitle}
            accessible={true}
            accessibilityRole="header"
            accessibilityLabel="No cities online"
          >
            NO CITIES ONLINE
          </CyberText>
          <CyberText 
            variant="body" 
            style={styles.emptySubtext}
            accessibilityLabel="Add your first city to start using the world clock"
          >
            Initialize your global time network by adding your first city to the cyberpunk database
          </CyberText>
          <CyberButton
            onPress={navigateToAddCity}
            variant="primary"
            style={styles.emptyButton}
            accessibilityLabel="Add first city to world clock"
            accessibilityHint="Opens the city selection screen"
            testID="add-first-city-button"
          >
            + ADD FIRST CITY
          </CyberButton>
        </Animatable.View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[CyberpunkTheme.colors.background, CyberpunkTheme.colors.surfaceVariant]}
      style={styles.container}
      accessible={false} // Container should not be focusable
    >
      {/* Header */}
      <View 
        style={styles.header}
        accessible={true}
        accessibilityRole="banner"
        accessibilityLabel="Global Time Network header"
      >
        <CyberText 
          variant="headline" 
          glow 
          style={styles.title}
          accessibilityRole="header"
          accessibilityLabel="Global Time Network"
        >
          🌍 GLOBAL TIME NETWORK
        </CyberText>
        <CyberText 
          variant="caption" 
          style={styles.cityCount}
          accessibilityLabel={`${cities.length} ${cities.length === 1 ? 'city' : 'cities'} connected to the network`}
        >
          {cities.length} {cities.length === 1 ? 'CITY' : 'CITIES'} CONNECTED
        </CyberText>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[CyberpunkTheme.colors.primary]}
            tintColor={CyberpunkTheme.colors.primary}
            accessibilityLabel="Pull to refresh time data"
          />
        }
        showsVerticalScrollIndicator={false}
        accessible={false}
        accessibilityLabel="List of world clocks"
        testID="city-list-scroll"
      >
        <View style={styles.cityList}>
          {cities.map((city, index) => (
            <Animatable.View 
              key={city.timezone} 
              animation="fadeInRight" 
              delay={index * 200}
              duration={800}
              accessible={false} // Let CityItem handle its own accessibility
            >
              <CityItem
                city={city}
                settings={settings}
                currentTime={currentTime}
                onRemove={handleRemoveCity}
                showDelete={cities.length > 1}
                cyberpunk={true}
                accessibilityLabel={`Time in ${city.name}, ${city.country}`}
                testID={`city-item-${city.timezone.replace('/', '-')}`}
              />
              {index < cities.length - 1 && (
                <HoloDivider 
                  style={styles.divider} 
                  accessible={false}
                />
              )}
            </Animatable.View>
          ))}
        </View>

        {/* Statistics Card */}
        <NeonCard 
          style={styles.statsCard} 
          glowColor={CyberpunkTheme.colors.info}
          accessible={true}
          accessibilityRole="region"
          accessibilityLabel="Network status information"
          testID="network-stats-card"
        >
          <CyberText 
            variant="title" 
            glow 
            style={styles.statsTitle}
            accessibilityRole="header"
            accessibilityLabel="Network Status"
          >
            NETWORK STATUS
          </CyberText>
          <View 
            style={styles.statsGrid}
            accessible={false}
          >
            <View 
              style={styles.statItem}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel={`Active zones: ${cities.length}`}
            >
              <CyberText variant="caption" style={styles.statLabel}>
                ACTIVE ZONES
              </CyberText>
              <CyberText variant="body" style={[styles.statValue, { color: CyberpunkTheme.colors.primary }]}>
                {cities.length}
              </CyberText>
            </View>
            <View 
              style={styles.statItem}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel="Sync status: Online"
            >
              <CyberText variant="caption" style={styles.statLabel}>
                SYNC STATUS
              </CyberText>
              <CyberText variant="body" style={[styles.statValue, { color: CyberpunkTheme.colors.success }]}>
                ONLINE
              </CyberText>
            </View>
            <View 
              style={styles.statItem}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel={`Auto update: ${settings.autoUpdateEnabled !== false ? 'Enabled' : 'Disabled'}`}
            >
              <CyberText variant="caption" style={styles.statLabel}>
                AUTO UPDATE
              </CyberText>
              <CyberText variant="body" style={[styles.statValue, { 
                color: settings.autoUpdateEnabled !== false 
                  ? CyberpunkTheme.colors.success 
                  : CyberpunkTheme.colors.warning 
              }]}>
                {settings.autoUpdateEnabled !== false ? 'ENABLED' : 'DISABLED'}
              </CyberText>
            </View>
            <View 
              style={styles.statItem}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel={`Time format: ${settings.is24Hour ? '24 hour' : '12 hour'}`}
            >
              <CyberText variant="caption" style={styles.statLabel}>
                TIME FORMAT
              </CyberText>
              <CyberText variant="body" style={[styles.statValue, { color: CyberpunkTheme.colors.secondary }]}>
                {settings.is24Hour ? '24H' : '12H'}
              </CyberText>
            </View>
          </View>
        </NeonCard>

        <View 
          style={styles.bottomPadding}
          accessible={false}
        />
      </ScrollView>
      
      {/* Accessible Cyberpunk Add City Button */}
      <Animatable.View 
        animation="bounceIn" 
        delay={1000}
        style={styles.fabContainer}
        accessible={false}
      >
        <CyberButton
          onPress={navigateToAddCity}
          variant="primary"
          style={styles.cyberFab}
          glowIntensity={0.8}
          accessibilityLabel="Add new city to world clock"
          accessibilityHint="Opens the city selection screen to add more cities"
          accessibilityRole="button"
          testID="add-city-fab"
        >
          <CyberIcon 
            name="add" 
            size={28} 
            color={CyberpunkTheme.colors.background}
            accessible={false} // Icon is decorative, button has the label
          />
        </CyberButton>
      </Animatable.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: CyberpunkTheme.spacing.lg,
    paddingHorizontal: CyberpunkTheme.spacing.lg,
    paddingTop: 60, // Account for status bar
  },
  title: {
    fontSize: 24,
    marginBottom: CyberpunkTheme.spacing.xs,
  },
  cityCount: {
    opacity: 0.7,
    fontSize: 12,
    letterSpacing: 1,
  },
  scrollView: {
    flex: 1,
  },
  cityList: {
    paddingHorizontal: CyberpunkTheme.spacing.lg,
    paddingBottom: CyberpunkTheme.spacing.lg,
  },
  divider: {
    marginVertical: CyberpunkTheme.spacing.sm,
  },
  statsCard: {
    margin: CyberpunkTheme.spacing.lg,
    marginTop: CyberpunkTheme.spacing.xl,
    padding: CyberpunkTheme.spacing.lg,
  },
  statsTitle: {
    textAlign: 'center',
    marginBottom: CyberpunkTheme.spacing.lg,
    fontSize: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    minWidth: '45%',
    marginBottom: CyberpunkTheme.spacing.md,
  },
  statLabel: {
    opacity: 0.7,
    marginBottom: CyberpunkTheme.spacing.xs,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  statValue: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  bottomPadding: {
    height: 100,
  },
  fabContainer: {
    position: 'absolute',
    bottom: CyberpunkTheme.spacing.lg,
    right: CyberpunkTheme.spacing.lg,
  },
  cyberFab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: CyberpunkTheme.spacing.xl,
  },
  emptyContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  emptyIcon: {
    marginBottom: CyberpunkTheme.spacing.xl,
  },
  emptyTitle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: CyberpunkTheme.spacing.lg,
  },
  emptySubtext: {
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: CyberpunkTheme.spacing.xxl,
    lineHeight: 22,
  },
  emptyButton: {
    paddingHorizontal: CyberpunkTheme.spacing.xl,
    paddingVertical: CyberpunkTheme.spacing.md,
  },
});

export default HomeScreen;