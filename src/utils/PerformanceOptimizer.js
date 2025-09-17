import { Platform } from 'react-native';

// Performance optimization utilities for World Clock app
export class PerformanceOptimizer {
  
  // Debounce function for search inputs
  static debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  }

  // Throttle function for scroll events
  static throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Memoization for expensive calculations
  static memoize(fn, getKey = (...args) => JSON.stringify(args)) {
    const cache = new Map();
    return (...args) => {
      const key = getKey(...args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = fn(...args);
      cache.set(key, result);
      return result;
    };
  }

  // Optimized list rendering for large datasets
  static getOptimalItemHeight() {
    return Platform.select({
      ios: 80,
      android: 85,
      web: 90,
      default: 85,
    });
  }

  // Batch operations to reduce re-renders
  static batchUpdates(operations) {
    // Use React's unstable_batchedUpdates if available
    if (typeof window !== 'undefined' && window.React && window.React.unstable_batchedUpdates) {
      window.React.unstable_batchedUpdates(() => {
        operations.forEach(op => op());
      });
    } else {
      // Fallback: execute operations with minimal delay
      operations.forEach((op, index) => {
        setTimeout(op, index * 10);
      });
    }
  }

  // Memory management for long lists
  static createVirtualizedListProps(data, itemHeight = 85) {
    return {
      data,
      getItemLayout: (data, index) => ({
        length: itemHeight,
        offset: itemHeight * index,
        index,
      }),
      initialNumToRender: 10,
      maxToRenderPerBatch: 5,
      updateCellsBatchingPeriod: 100,
      windowSize: 10,
      removeClippedSubviews: Platform.OS === 'android',
      keyExtractor: (item, index) => item.timezone || `item-${index}`,
    };
  }

  // Image and asset optimization
  static getOptimizedImageProps(source, size = 'medium') {
    const sizes = {
      small: { width: 24, height: 24 },
      medium: { width: 48, height: 48 },
      large: { width: 72, height: 72 },
    };

    return {
      source,
      ...sizes[size],
      resizeMode: 'contain',
      fadeDuration: Platform.OS === 'android' ? 300 : 0,
    };
  }

  // Animation performance optimization
  static getOptimizedAnimationConfig() {
    return {
      useNativeDriver: true,
      duration: Platform.select({
        ios: 300,
        android: 250,
        web: 200,
      }),
      // Reduce animations on low-end devices
      isInteractionEnabled: !this.isLowEndDevice(),
    };
  }

  // Device capability detection
  static isLowEndDevice() {
    if (Platform.OS === 'web') {
      // Basic web performance detection
      return navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 2;
    }
    // For mobile, this would require native module or estimation
    return false;
  }

  // Network optimization
  static createNetworkOptimizedFetch(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || 10000);

    return fetch(url, {
      ...options,
      signal: controller.signal,
    }).finally(() => {
      clearTimeout(timeoutId);
    });
  }

  // Accessibility optimization
  static createAccessibilityProps(label, hint, role = 'button') {
    return {
      accessible: true,
      accessibilityLabel: label,
      accessibilityHint: hint,
      accessibilityRole: role,
      // Optimize for screen readers
      importantForAccessibility: 'yes',
    };
  }

  // Cross-platform style optimization
  static optimizeStylesForPlatform(styles) {
    return Platform.select({
      ios: {
        ...styles,
        // iOS specific optimizations
        shadowOpacity: Math.min(styles.shadowOpacity || 0.3, 0.3),
      },
      android: {
        ...styles,
        // Android specific optimizations
        elevation: Math.min(styles.elevation || 5, 8),
      },
      web: {
        ...styles,
        // Web specific optimizations - avoid deprecated properties
        boxShadow: styles.shadowColor ? 
          `0px 2px 8px rgba(0,0,0,${styles.shadowOpacity || 0.1})` : 
          undefined,
        // Remove mobile-specific properties
        shadowColor: undefined,
        shadowOpacity: undefined,
        shadowRadius: undefined,
        shadowOffset: undefined,
        elevation: undefined,
      },
    });
  }

  // Bundle size optimization - lazy loading helper
  static lazyLoad(importFunc, fallback = null) {
    return React.lazy(() => 
      importFunc().catch(() => ({ 
        default: fallback || (() => null) 
      }))
    );
  }

  // State management optimization
  static createOptimizedReducer(initialState, handlers) {
    return (state = initialState, action) => {
      const handler = handlers[action.type];
      return handler ? handler(state, action) : state;
    };
  }

  // Error boundary optimization
  static createErrorBoundary(FallbackComponent) {
    return class OptimizedErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
      }

      static getDerivedStateFromError(error) {
        return { hasError: true, error };
      }

      componentDidCatch(error, errorInfo) {
        console.error('Performance Optimized Error Boundary caught an error:', error, errorInfo);
      }

      render() {
        if (this.state.hasError) {
          return FallbackComponent ? 
            <FallbackComponent error={this.state.error} /> : 
            <div>Something went wrong.</div>;
        }
        return this.props.children;
      }
    };
  }
}

// React hooks for performance optimization
export const useOptimizedCallback = (callback, deps) => {
  return React.useCallback(
    PerformanceOptimizer.memoize(callback),
    deps
  );
};

export const useOptimizedMemo = (factory, deps) => {
  return React.useMemo(
    PerformanceOptimizer.memoize(factory),
    deps
  );
};

// Export performance metrics
export const PerformanceMetrics = {
  startTiming: (label) => {
    if (Platform.OS === 'web' && performance.mark) {
      performance.mark(`${label}-start`);
    }
  },
  
  endTiming: (label) => {
    if (Platform.OS === 'web' && performance.measure) {
      performance.mark(`${label}-end`);
      performance.measure(label, `${label}-start`, `${label}-end`);
    }
  },
  
  getMetrics: () => {
    if (Platform.OS === 'web' && performance.getEntriesByType) {
      return performance.getEntriesByType('measure');
    }
    return [];
  }
};

export default PerformanceOptimizer;