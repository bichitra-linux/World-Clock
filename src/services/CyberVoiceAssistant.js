import * as Speech from 'expo-speech';
import { CyberpunkTheme } from '../theme/CyberpunkTheme';

export class CyberVoiceAssistant {
  constructor() {
    this.isListening = false;
    this.isActive = false;
    this.commands = {
      // Time commands
      'what time is it': this.getCurrentTime,
      'current time': this.getCurrentTime,
      'time now': this.getCurrentTime,
      
      // City commands
      'add city': this.suggestAddCity,
      'remove city': this.suggestRemoveCity,
      'show cities': this.listCities,
      
      // Timer commands
      'start timer': this.startTimer,
      'stop timer': this.stopTimer,
      'set timer': this.setTimer,
      
      // Stopwatch commands
      'start stopwatch': this.startStopwatch,
      'stop stopwatch': this.stopStopwatch,
      'reset stopwatch': this.resetStopwatch,
      
      // Alarm commands
      'set alarm': this.setAlarm,
      'show alarms': this.listAlarms,
      
      // Settings commands
      'open settings': this.openSettings,
      'change theme': this.changeTheme,
      'toggle format': this.toggleTimeFormat,
      
      // Help commands
      'help': this.showHelp,
      'commands': this.showHelp,
      'what can you do': this.showHelp,
      
      // Fun cyberpunk responses
      'hello': this.greetUser,
      'hi': this.greetUser,
      'good morning': this.greetUser,
      'good evening': this.greetUser,
    };
  }

  // Initialize the voice assistant
  initialize() {
    this.isActive = true;
    this.speak('Cyber voice assistant online. Neural networks activated. How may I assist you?');
  }

  // Shutdown the voice assistant
  shutdown() {
    this.isActive = false;
    this.speak('Voice assistant going offline. Neural networks deactivated.');
  }

  // Speak text with cyberpunk personality
  speak(text, options = {}) {
    const defaultOptions = {
      language: 'en-US',
      pitch: 0.8, // Slightly lower pitch for cyberpunk effect
      rate: 0.9, // Slightly slower for dramatic effect
      ...options
    };

    Speech.speak(text, defaultOptions);
  }

  // Process voice commands
  processCommand(command, navigation, settings, cities) {
    const normalizedCommand = command.toLowerCase().trim();
    
    // Find matching command
    const matchedCommand = Object.keys(this.commands).find(cmd => 
      normalizedCommand.includes(cmd) || cmd.includes(normalizedCommand)
    );

    if (matchedCommand) {
      const response = this.commands[matchedCommand](navigation, settings, cities, normalizedCommand);
      this.speak(response);
      return response;
    } else {
      const response = "Command not recognized in my neural database. Say 'help' to view available protocols.";
      this.speak(response);
      return response;
    }
  }

  // Command implementations
  getCurrentTime = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    return `Current system time is ${timeString}. Time sync confirmed.`;
  }

  suggestAddCity = (navigation) => {
    if (navigation) {
      navigation.navigate('AddCity');
    }
    return "Accessing global city database. Navigate to add city interface to expand your time network.";
  }

  suggestRemoveCity = () => {
    return "To disconnect a city from your network, long press on any city card in the main interface.";
  }

  listCities = (navigation, settings, cities) => {
    if (!cities || cities.length === 0) {
      return "No cities currently connected to your time network. Recommend adding cities to establish global coverage.";
    }
    
    const cityNames = cities.map(city => city.name).join(', ');
    return `${cities.length} cities active in your network: ${cityNames}. All nodes synchronized.`;
  }

  startTimer = (navigation) => {
    if (navigation) {
      navigation.navigate('Timer');
    }
    return "Accessing cyber timer module. Navigate to timer interface to initialize countdown protocol.";
  }

  stopTimer = () => {
    return "Timer control requires direct interface interaction. Access timer screen to modify countdown parameters.";
  }

  setTimer = (navigation, settings, cities, command) => {
    if (navigation) {
      navigation.navigate('Timer');
    }
    // Try to extract time from command
    const timeMatch = command.match(/(\d+)\s*(minutes?|mins?|seconds?|secs?)/i);
    if (timeMatch) {
      const amount = timeMatch[1];
      const unit = timeMatch[2].toLowerCase();
      return `Setting ${amount} ${unit} timer. Navigate to timer interface to confirm parameters.`;
    }
    return "Timer module activated. Specify duration in timer interface.";
  }

  startStopwatch = (navigation) => {
    if (navigation) {
      navigation.navigate('Stopwatch');
    }
    return "Precision timing module online. Navigate to stopwatch interface to begin chronometry.";
  }

  stopStopwatch = () => {
    return "Stopwatch control requires direct neural interface. Access stopwatch screen to modify timing parameters.";
  }

  resetStopwatch = () => {
    return "Stopwatch reset protocol requires interface confirmation. Navigate to stopwatch module.";
  }

  setAlarm = (navigation) => {
    if (navigation) {
      navigation.navigate('Alarm');
    }
    return "Alarm protocol initialized. Navigate to alarm interface to configure wake sequences.";
  }

  listAlarms = (navigation) => {
    if (navigation) {
      navigation.navigate('Alarm');
    }
    return "Accessing alarm database. Navigate to alarm interface to view all configured wake protocols.";
  }

  openSettings = (navigation) => {
    if (navigation) {
      navigation.navigate('Settings');
    }
    return "Accessing system configuration. Navigate to cyber settings to modify neural parameters.";
  }

  changeTheme = (navigation) => {
    if (navigation) {
      navigation.navigate('Settings');
    }
    return "Visual interface customization available in cyber settings. Navigate to appearance configuration.";
  }

  toggleTimeFormat = () => {
    return "Time format toggle available in system settings. Access settings interface to switch between 12 and 24 hour displays.";
  }

  showHelp = () => {
    const commands = [
      "Time queries: 'what time is it', 'current time'",
      "Navigation: 'add city', 'open settings', 'start timer'", 
      "Controls: 'set alarm', 'start stopwatch', 'show cities'",
      "System: 'change theme', 'toggle format', 'help'"
    ];
    return `Available voice protocols: ${commands.join('. ')}. Neural interface ready for commands.`;
  }

  greetUser = () => {
    const greetings = [
      "Greetings, user. Cyber assistant online and ready for neural interface commands.",
      "Welcome to the cyberpunk time matrix. How may I assist your chronological needs?",
      "Neural networks activated. Voice assistant ready to serve your temporal requirements.",
      "System online. Awaiting your commands in the global time network.",
      "Cyberpunk protocol engaged. Voice interface ready for time-space operations."
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Get available voices (for customization)
  async getAvailableVoices() {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      return voices;
    } catch (error) {
      console.error('Error getting voices:', error);
      return [];
    }
  }

  // Stop current speech
  stopSpeaking() {
    Speech.stop();
  }

  // Check if currently speaking
  isSpeaking() {
    return Speech.isSpeakingAsync();
  }

  // Get random cyberpunk phrases for ambiance
  getCyberpunkPhrase() {
    const phrases = [
      "Neural matrix synchronized.",
      "Quantum time calculations complete.",
      "Cybernetic interface active.",
      "Temporal algorithms processing.",
      "Digital consciousness online.",
      "Neon protocols initialized.",
      "Synthetic intelligence ready.",
      "Holographic systems operational."
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }
}

// Singleton instance
export const cyberVoiceAssistant = new CyberVoiceAssistant();