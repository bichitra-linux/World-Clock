import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as Animatable from 'react-native-animatable';
import { CyberpunkTheme } from '../theme/CyberpunkTheme';
import { CyberText, NeonCard, CyberButton, CyberInput } from '../components/CyberpunkUI';
import { TimeService, SEARCHABLE_CITIES, mergeSort } from '../utils/TimeService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment-timezone';

const { width } = Dimensions.get('window');

const TimeZoneConverter = ({ navigation, settings }) => {
  const [sourceCity, setSourceCity] = useState(null);
  const [targetCity, setTargetCity] = useState(null);
  const [sourceTime, setSourceTime] = useState(moment().format('HH:mm'));
  const [conversionResult, setConversionResult] = useState(null);
  const [showSourceCities, setShowSourceCities] = useState(false);
  const [showTargetCities, setShowTargetCities] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Continuous pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Enhanced popular cities with cyberpunk styling data
  const popularCities = mergeSort([
    { name: 'New York', country: 'USA', timezone: 'America/New_York', color: CyberpunkTheme.colors.neonCyan },
    { name: 'London', country: 'UK', timezone: 'Europe/London', color: CyberpunkTheme.colors.neonPink },
    { name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', color: CyberpunkTheme.colors.accent },
    { name: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', color: CyberpunkTheme.colors.neonGreen },
    { name: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai', color: CyberpunkTheme.colors.neonOrange },
    { name: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles', color: CyberpunkTheme.colors.neonCyan },
    { name: 'Paris', country: 'France', timezone: 'Europe/Paris', color: CyberpunkTheme.colors.neonPink },
    { name: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', color: CyberpunkTheme.colors.accent },
    { name: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', color: CyberpunkTheme.colors.neonGreen },
    { name: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', color: CyberpunkTheme.colors.neonOrange },
  ], 'name');

  const handleSourceCitySelect = useCallback((city) => {
    setSourceCity(city);
    setShowSourceCities(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (targetCity) {
      convertTime(city, targetCity, sourceTime);
    }
  }, [targetCity, sourceTime]);

  const handleTargetCitySelect = useCallback((city) => {
    setTargetCity(city);
    setShowTargetCities(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (sourceCity) {
      convertTime(sourceCity, city, sourceTime);
    }
  }, [sourceCity, sourceTime]);

  const convertTime = useCallback(async (source, target, time) => {
    if (!source || !target || !time) return;
    
    setIsConverting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Add small delay for cyberpunk effect
    setTimeout(() => {
      const result = TimeService.convertTime(source, target, time);
      setConversionResult(result);
      setIsConverting(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 800);
  }, []);

  const handleTimeChange = useCallback((time) => {
    setSourceTime(time);
    if (sourceCity && targetCity) {
      convertTime(sourceCity, targetCity, time);
    }
  }, [sourceCity, targetCity, convertTime]);

  const swapCities = useCallback(() => {
    const temp = sourceCity;
    setSourceCity(targetCity);
    setTargetCity(temp);
    
    if (sourceCity && targetCity) {
      convertTime(targetCity, sourceCity, sourceTime);
    }
  }, [sourceCity, targetCity, sourceTime, convertTime]);

  const setCurrentTime = useCallback(() => {
    const currentTime = moment().format('HH:mm');
    setSourceTime(currentTime);
    if (sourceCity && targetCity) {
      convertTime(sourceCity, targetCity, currentTime);
    }
  }, [sourceCity, targetCity, convertTime]);

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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animatable.View animation="slideInDown" duration={800} style={styles.header}>
          <CyberText variant="title" style={styles.title} glowIntensity={1}>
            NEURAL TIME CONVERTER
          </CyberText>
          <CyberText variant="subtitle" style={styles.subtitle}>
            Quantum Temporal Translation Matrix
          </CyberText>
        </Animatable.View>

        {/* Source City Selection */}
        <Animatable.View animation="slideInLeft" duration={800} delay={200}>
          <NeonCard style={styles.card} glowIntensity={0.5}>
            <CyberText variant="subtitle" style={styles.sectionTitle} glowIntensity={0.3}>
              SOURCE TEMPORAL NODE
            </CyberText>
            <CyberButton
              onPress={() => setShowSourceCities(!showSourceCities)}
              style={styles.cityButton}
              variant={sourceCity ? "primary" : "secondary"}
              glowIntensity={sourceCity ? 0.7 : 0.3}
            >
              <Icon 
                name="location-on" 
                size={20} 
                color={sourceCity ? CyberpunkTheme.colors.background : CyberpunkTheme.colors.neonCyan} 
              />
              <CyberText variant="button" style={styles.buttonText}>
                {sourceCity ? `${sourceCity.name}, ${sourceCity.country}` : 'SELECT SOURCE NODE'}
              </CyberText>
            </CyberButton>
            
            {showSourceCities && (
              <Animatable.View animation="slideInUp" duration={400} style={styles.cityGrid}>
                <CyberText variant="caption" style={styles.gridTitle}>
                  AVAILABLE TEMPORAL NODES
                </CyberText>
                <View style={styles.cityChips}>
                  {popularCities.map((city, index) => (
                    <Animatable.View
                      key={city.timezone}
                      animation="zoomIn"
                      duration={400}
                      delay={index * 50}
                    >
                      <TouchableOpacity
                        style={[
                          styles.cityChip,
                          { borderColor: city.color || CyberpunkTheme.colors.neonCyan }
                        ]}
                        onPress={() => handleSourceCitySelect(city)}
                        activeOpacity={0.7}
                      >
                        <CyberText variant="caption" style={styles.chipText}>
                          {city.name}
                        </CyberText>
                      </TouchableOpacity>
                    </Animatable.View>
                  ))}
                </View>
              </Animatable.View>
            )}
          </NeonCard>
        </Animatable.View>

        {/* Time Input */}
        <Animatable.View animation="fadeIn" duration={800} delay={400}>
          <NeonCard style={styles.card} glowIntensity={0.5}>
            <CyberText variant="subtitle" style={styles.sectionTitle} glowIntensity={0.3}>
              TEMPORAL INPUT MATRIX
            </CyberText>
            <View style={styles.timeInputContainer}>
              <CyberInput
                value={sourceTime}
                onChangeText={handleTimeChange}
                placeholder="14:30"
                style={styles.timeInput}
                keyboardType="numeric"
                maxLength={5}
                glowIntensity={0.4}
              />
              <CyberButton
                onPress={setCurrentTime}
                style={styles.nowButton}
                variant="secondary"
                glowIntensity={0.6}
              >
                <Icon name="access-time" size={16} color={CyberpunkTheme.colors.neonCyan} />
                <CyberText variant="button" style={styles.nowButtonText}>
                  NOW
                </CyberText>
              </CyberButton>
            </View>
          </NeonCard>
        </Animatable.View>

        {/* Swap Button */}
        {sourceCity && targetCity && (
          <Animatable.View 
            animation="bounceIn" 
            duration={800} 
            style={styles.swapContainer}
          >
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <CyberButton
                onPress={swapCities}
                style={styles.swapButton}
                variant="accent"
                glowIntensity={0.8}
              >
                <Icon name="swap-vert" size={24} color={CyberpunkTheme.colors.background} />
                <CyberText variant="button" style={styles.swapButtonText}>
                  NEURAL SWAP
                </CyberText>
              </CyberButton>
            </Animated.View>
          </Animatable.View>
        )}

        {/* Target City Selection */}
        <Animatable.View animation="slideInRight" duration={800} delay={600}>
          <NeonCard style={styles.card} glowIntensity={0.5}>
            <CyberText variant="subtitle" style={styles.sectionTitle} glowIntensity={0.3}>
              TARGET TEMPORAL NODE
            </CyberText>
            <CyberButton
              onPress={() => setShowTargetCities(!showTargetCities)}
              style={styles.cityButton}
              variant={targetCity ? "primary" : "secondary"}
              glowIntensity={targetCity ? 0.7 : 0.3}
            >
              <Icon 
                name="place" 
                size={20} 
                color={targetCity ? CyberpunkTheme.colors.background : CyberpunkTheme.colors.neonPink} 
              />
              <CyberText variant="button" style={styles.buttonText}>
                {targetCity ? `${targetCity.name}, ${targetCity.country}` : 'SELECT TARGET NODE'}
              </CyberText>
            </CyberButton>
            
            {showTargetCities && (
              <Animatable.View animation="slideInUp" duration={400} style={styles.cityGrid}>
                <CyberText variant="caption" style={styles.gridTitle}>
                  AVAILABLE TEMPORAL NODES
                </CyberText>
                <View style={styles.cityChips}>
                  {popularCities.map((city, index) => (
                    <Animatable.View
                      key={city.timezone}
                      animation="zoomIn"
                      duration={400}
                      delay={index * 50}
                    >
                      <TouchableOpacity
                        style={[
                          styles.cityChip,
                          { borderColor: city.color || CyberpunkTheme.colors.neonPink }
                        ]}
                        onPress={() => handleTargetCitySelect(city)}
                        activeOpacity={0.7}
                      >
                        <CyberText variant="caption" style={styles.chipText}>
                          {city.name}
                        </CyberText>
                      </TouchableOpacity>
                    </Animatable.View>
                  ))}
                </View>
              </Animatable.View>
            )}
          </NeonCard>
        </Animatable.View>

        {/* Conversion Result */}
        {conversionResult && (
          <Animatable.View animation="bounceIn" duration={1000} delay={800}>
            <NeonCard style={styles.resultCard} glowIntensity={1}>
              <Animated.View style={[
                styles.resultHeader,
                { opacity: glowAnim }
              ]}>
                <CyberText variant="subtitle" style={styles.resultTitle} glowIntensity={0.8}>
                  TEMPORAL CONVERSION COMPLETE
                </CyberText>
              </Animated.View>
              
              <View style={styles.conversionMatrix}>
                <View style={styles.resultRow}>
                  <View style={styles.sourceNode}>
                    <CyberText variant="body" style={styles.nodeLabel}>
                      SOURCE NODE: {sourceCity?.name?.toUpperCase()}
                    </CyberText>
                    <CyberText variant="title" style={styles.timeDisplay} glowIntensity={0.6}>
                      {conversionResult.sourceTime}
                    </CyberText>
                    <CyberText variant="caption" style={styles.dateDisplay}>
                      {conversionResult.sourceDatetime}
                    </CyberText>
                  </View>
                  
                  <View style={styles.conversionArrow}>
                    {isConverting ? (
                      <Animatable.View
                        animation="pulse"
                        iterationCount="infinite"
                        duration={500}
                      >
                        <Icon 
                          name="sync" 
                          size={30} 
                          color={CyberpunkTheme.colors.accent} 
                        />
                      </Animatable.View>
                    ) : (
                      <Animatable.View animation="bounceIn" duration={800}>
                        <Icon 
                          name="arrow-forward" 
                          size={30} 
                          color={CyberpunkTheme.colors.neonCyan} 
                        />
                      </Animatable.View>
                    )}
                  </View>
                  
                  <View style={styles.targetNode}>
                    <CyberText variant="body" style={styles.nodeLabel}>
                      TARGET NODE: {targetCity?.name?.toUpperCase()}
                    </CyberText>
                    <CyberText variant="title" style={styles.timeDisplay} glowIntensity={0.6}>
                      {conversionResult.targetTime}
                    </CyberText>
                    <CyberText variant="caption" style={styles.dateDisplay}>
                      {conversionResult.targetDatetime}
                    </CyberText>
                  </View>
                </View>
                
                {isConverting && (
                  <Animatable.View
                    animation="pulse"
                    iterationCount="infinite"
                    style={styles.processingIndicator}
                  >
                    <Icon name="psychology" size={20} color={CyberpunkTheme.colors.accent} />
                    <CyberText variant="caption" style={styles.processingText}>
                      Neural processing temporal data...
                    </CyberText>
                  </Animatable.View>
                )}
              </View>
            </NeonCard>
          </Animatable.View>
        )}

        {/* Instructions */}
        <Animatable.View animation="fadeInUp" duration={800} delay={1000}>
          <NeonCard style={styles.instructionsCard} glowIntensity={0.3}>
            <CyberText variant="subtitle" style={styles.instructionsTitle} glowIntensity={0.4}>
              NEURAL INTERFACE PROTOCOL
            </CyberText>
            <View style={styles.instructionsList}>
              {[
                'Initialize source temporal node selection',
                'Input chronological data matrix values',
                'Configure target temporal node parameters',
                'Execute quantum conversion algorithms'
              ].map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.instructionNumber}>
                    <CyberText variant="caption" style={styles.numberText}>
                      {index + 1}
                    </CyberText>
                  </View>
                  <CyberText variant="body" style={styles.instructionText}>
                    {instruction}
                  </CyberText>
                </View>
              ))}
            </View>
          </NeonCard>
        </Animatable.View>

      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
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
  card: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: CyberpunkTheme.colors.neonCyan,
  },
  cityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginBottom: 15,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  cityGrid: {
    marginTop: 15,
  },
  gridTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: CyberpunkTheme.colors.textSecondary,
    textAlign: 'center',
  },
  cityChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  cityChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: CyberpunkTheme.borderRadius.sm,
    borderWidth: 1,
    backgroundColor: CyberpunkTheme.colors.surface,
    minWidth: 80,
    alignItems: 'center',
  },
  chipText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: CyberpunkTheme.colors.textPrimary,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timeInput: {
    flex: 1,
  },
  nowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  nowButtonText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
  swapContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  swapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  swapButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: CyberpunkTheme.colors.background,
  },
  resultCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    backgroundColor: CyberpunkTheme.colors.surface,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: CyberpunkTheme.colors.neonCyan,
    textAlign: 'center',
  },
  conversionMatrix: {
    alignItems: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  sourceNode: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    backgroundColor: CyberpunkTheme.colors.background,
    borderRadius: CyberpunkTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: CyberpunkTheme.colors.neonCyan,
  },
  targetNode: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    backgroundColor: CyberpunkTheme.colors.background,
    borderRadius: CyberpunkTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: CyberpunkTheme.colors.neonPink,
  },
  conversionArrow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  nodeLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    opacity: 0.8,
  },
  timeDisplay: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  dateDisplay: {
    fontSize: 10,
    textAlign: 'center',
    opacity: 0.7,
  },
  processingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: CyberpunkTheme.colors.background,
    borderRadius: CyberpunkTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: CyberpunkTheme.colors.accent,
  },
  processingText: {
    marginLeft: 10,
    color: CyberpunkTheme.colors.accent,
    fontSize: 12,
  },
  instructionsCard: {
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 20,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: CyberpunkTheme.colors.neonCyan,
  },
  instructionsList: {
    gap: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: CyberpunkTheme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  numberText: {
    color: CyberpunkTheme.colors.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: CyberpunkTheme.colors.textPrimary,
  },
});

export default TimeZoneConverter;