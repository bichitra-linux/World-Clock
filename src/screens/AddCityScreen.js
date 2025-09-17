import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

import { CyberpunkTheme } from '../theme/CyberpunkTheme';
import { NeonCard, NeonButton, CyberText, HoloDivider, CyberIcon } from '../components/CyberpunkUI';
import { TimeService } from '../utils/TimeService';

const AddCityScreen = ({ navigation, onAddCity, existingCities }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Memoize search results for performance
  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
    setIsSearching(true);
    const results = TimeService.searchCities(searchQuery);
    // Filter out cities that are already added
    const filtered = results.filter(city => 
      !existingCities.some(existing => existing.timezone === city.timezone)
    );
    setIsSearching(false);
    return filtered.slice(0, 50); // Limit results for performance
  }, [searchQuery, existingCities]);

  const handleAddCity = useCallback(async (city) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      '🌍 ADD CITY TO NETWORK',
      `Connect ${city.name}, ${city.country} to your cyberpunk time network?`,
      [
        {
          text: 'CANCEL',
          style: 'cancel',
        },
        {
          text: 'CONNECT',
          onPress: async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            onAddCity(city);
            navigation.goBack();
          },
        },
      ]
    );
  }, [onAddCity, navigation]);

  const handleSearchChange = async (text) => {
    if (text.length > 0) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSearchQuery(text);
  };

  const renderCityItem = useCallback(({ item: city, index }) => (
    <Animatable.View 
      animation="fadeInRight" 
      delay={index * 100} 
      key={city.timezone}
    >
      <NeonCard 
        style={styles.cityCard} 
        glowColor={CyberpunkTheme.colors.info}
        onPress={() => handleAddCity(city)}
      >
        <View style={styles.cityContent}>
          <View style={styles.cityInfo}>
            <CyberText variant="title" style={styles.cityName} glow>
              {city.name.toUpperCase()}
            </CyberText>
            <CyberText variant="body" style={styles.countryName}>
              {city.country.toUpperCase()}
            </CyberText>
            <View style={styles.timezoneRow}>
              <CyberIcon name="earth" size={16} color={CyberpunkTheme.colors.secondary} />
              <CyberText variant="caption" style={styles.timezoneText}>
                {city.timezone}
              </CyberText>
            </View>
          </View>
          <View style={styles.addButton}>
            <NeonButton
              title=""
              onPress={() => handleAddCity(city)}
              variant="primary"
              style={styles.addButtonStyle}
            >
              <CyberIcon name="plus-circle" size={24} color={CyberpunkTheme.colors.onPrimary} />
            </NeonButton>
          </View>
        </View>
      </NeonCard>
    </Animatable.View>
  ), [handleAddCity]);

  const renderEmptyComponent = useCallback(() => {
    if (searchQuery.length === 0) {
      return (
        <Animatable.View 
          animation="fadeInUp" 
          style={styles.emptyContainer}
        >
          <CyberIcon name="earth-off" size={64} color={CyberpunkTheme.colors.secondary} />
          <CyberText variant="title" glow style={styles.emptyTitle}>
            SEARCH GLOBAL DATABASE
          </CyberText>
          <CyberText variant="body" style={styles.emptyText}>
            Initialize search protocol by entering city name
          </CyberText>
        </Animatable.View>
      );
    } else if (searchQuery.length < 2) {
      return (
        <Animatable.View 
          animation="pulse" 
          style={styles.emptyContainer}
        >
          <CyberIcon name="magnify" size={48} color={CyberpunkTheme.colors.warning} />
          <CyberText variant="body" style={styles.emptyText}>
            Minimum 2 characters required for neural search
          </CyberText>
        </Animatable.View>
      );
    } else if (isSearching) {
      return (
        <Animatable.View 
          animation="rotate" 
          iterationCount="infinite"
          style={styles.emptyContainer}
        >
          <CyberIcon name="loading" size={48} color={CyberpunkTheme.colors.primary} />
          <CyberText variant="body" style={styles.emptyText}>
            Scanning global database...
          </CyberText>
        </Animatable.View>
      );
    } else {
      return (
        <Animatable.View 
          animation="fadeIn" 
          style={styles.emptyContainer}
        >
          <CyberIcon name="database-remove" size={48} color={CyberpunkTheme.colors.error} />
          <CyberText variant="body" style={styles.emptyText}>
            No cities found matching "{searchQuery}"
          </CyberText>
          <CyberText variant="caption" style={styles.emptySubtext}>
            Try different search parameters
          </CyberText>
        </Animatable.View>
      );
    }
  }, [searchQuery, isSearching]);

  return (
    <LinearGradient
      colors={[CyberpunkTheme.colors.background, CyberpunkTheme.colors.surfaceVariant]}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <CyberText variant="headline" glow style={styles.title}>
          🌐 ADD CITY NODE
        </CyberText>
        <CyberText variant="caption" style={styles.subtitle}>
          Expand your global time network
        </CyberText>
      </View>

      {/* Search Section */}
      <NeonCard style={styles.searchCard} glowColor={CyberpunkTheme.colors.primary}>
        <TextInput
          placeholder="Search global cities database..."
          value={searchQuery}
          onChangeText={handleSearchChange}
          style={styles.searchInput}
          theme={{
            colors: {
              primary: CyberpunkTheme.colors.primary,
              background: CyberpunkTheme.colors.surface,
              text: CyberpunkTheme.colors.onSurface,
              placeholder: CyberpunkTheme.colors.onSurface + '80',
            }
          }}
          left={<TextInput.Icon icon="magnify" iconColor={CyberpunkTheme.colors.primary} />}
          right={searchQuery.length > 0 ? (
            <TextInput.Icon 
              icon="close" 
              iconColor={CyberpunkTheme.colors.error}
              onPress={() => setSearchQuery('')}
            />
          ) : null}
        />
      </NeonCard>

      {/* Results */}
      <View style={styles.resultsContainer}>
        {searchResults.length > 0 && (
          <CyberText variant="body" style={styles.resultsCount}>
            {searchResults.length} CITIES FOUND
          </CyberText>
        )}
        
        <FlatList
          data={searchResults}
          renderItem={renderCityItem}
          keyExtractor={(item) => item.timezone}
          style={styles.list}
          ListEmptyComponent={renderEmptyComponent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: CyberpunkTheme.spacing.lg,
    paddingBottom: CyberpunkTheme.spacing.lg,
  },
  title: {
    fontSize: 24,
    marginBottom: CyberpunkTheme.spacing.xs,
  },
  subtitle: {
    opacity: 0.7,
    textAlign: 'center',
  },
  searchCard: {
    margin: CyberpunkTheme.spacing.lg,
    padding: CyberpunkTheme.spacing.md,
  },
  searchInput: {
    backgroundColor: CyberpunkTheme.colors.surface,
    fontSize: 16,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: CyberpunkTheme.spacing.lg,
  },
  resultsCount: {
    opacity: 0.8,
    marginBottom: CyberpunkTheme.spacing.md,
    fontSize: 12,
    letterSpacing: 1,
  },
  list: {
    flex: 1,
  },
  separator: {
    height: CyberpunkTheme.spacing.sm,
  },
  cityCard: {
    padding: CyberpunkTheme.spacing.lg,
    marginBottom: CyberpunkTheme.spacing.sm,
  },
  cityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 18,
    marginBottom: CyberpunkTheme.spacing.xs,
  },
  countryName: {
    opacity: 0.8,
    marginBottom: CyberpunkTheme.spacing.sm,
  },
  timezoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timezoneText: {
    marginLeft: CyberpunkTheme.spacing.sm,
    opacity: 0.7,
    fontSize: 12,
  },
  addButton: {
    marginLeft: CyberpunkTheme.spacing.lg,
  },
  addButtonStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: CyberpunkTheme.spacing.xxl,
  },
  emptyTitle: {
    fontSize: 20,
    marginVertical: CyberpunkTheme.spacing.lg,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: CyberpunkTheme.spacing.md,
    opacity: 0.8,
    lineHeight: 22,
  },
  emptySubtext: {
    textAlign: 'center',
    opacity: 0.6,
    fontSize: 12,
  },
});

export default AddCityScreen;