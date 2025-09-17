// Import web-specific polyfills first (only on web platform)
if (typeof window !== 'undefined') {
  require('./src/utils/WebPolyfills');
}

// Suppress React Native Web warnings before app initialization
if (typeof window !== 'undefined') {
  // Store original console methods
  const originalWarn = console.warn;
  const originalError = console.error;
  
  // Override console.warn to filter out React Native Web deprecation warnings
  console.warn = (...args) => {
    const message = args[0];
    if (typeof message === 'string') {
      // Suppress specific React Native Web warnings
      if (
        message.includes('"shadow*" style props are deprecated') ||
        message.includes('props.pointerEvents is deprecated') ||
        message.includes('Unexpected text node') ||
        message.includes('Use "boxShadow"') ||
        message.includes('Use style.pointerEvents')
      ) {
        return; // Don't log these warnings
      }
    }
    // Log all other warnings normally
    originalWarn.apply(console, args);
  };
  
  // Also filter console.error for similar messages
  console.error = (...args) => {
    const message = args[0];
    if (typeof message === 'string') {
      if (
        message.includes('shadow*') ||
        message.includes('pointerEvents is deprecated') ||
        message.includes('Unexpected text node')
      ) {
        return; // Don't log these errors
      }
    }
    // Log all other errors normally
    originalError.apply(console, args);
  };
}

import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);