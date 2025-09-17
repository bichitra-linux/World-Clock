// Web-specific polyfills to prevent React Native Web warnings
// This file should be imported before any React Native components

if (typeof window !== 'undefined') {
  
  // Override StyleSheet.create to intercept and clean shadow properties
  const originalStyleSheetCreate = require('react-native-web/dist/exports/StyleSheet/index.js').default.create;
  
  // Polyfill to clean deprecated properties
  const cleanStyles = (styles) => {
    if (!styles || typeof styles !== 'object') return styles;
    
    const cleanedStyles = {};
    for (const key in styles) {
      if (styles.hasOwnProperty(key)) {
        const style = styles[key];
        if (style && typeof style === 'object') {
          const cleanedStyle = { ...style };
          
          // Convert shadow* properties to boxShadow for web
          if (cleanedStyle.shadowColor || cleanedStyle.shadowOffset || cleanedStyle.shadowOpacity || cleanedStyle.shadowRadius) {
            const shadowColor = cleanedStyle.shadowColor || '#000';
            const shadowOffset = cleanedStyle.shadowOffset || { width: 0, height: 0 };
            const shadowOpacity = cleanedStyle.shadowOpacity || 0;
            const shadowRadius = cleanedStyle.shadowRadius || 0;
            
            if (shadowOpacity > 0) {
              // Convert to RGB values
              let r = 0, g = 0, b = 0;
              if (shadowColor.startsWith('#')) {
                const hex = shadowColor.substring(1);
                if (hex.length === 3) {
                  r = parseInt(hex[0] + hex[0], 16);
                  g = parseInt(hex[1] + hex[1], 16);
                  b = parseInt(hex[2] + hex[2], 16);
                } else if (hex.length === 6) {
                  r = parseInt(hex.substring(0, 2), 16);
                  g = parseInt(hex.substring(2, 4), 16);
                  b = parseInt(hex.substring(4, 6), 16);
                }
              }
              
              cleanedStyle.boxShadow = `${shadowOffset.width}px ${shadowOffset.height}px ${shadowRadius}px rgba(${r}, ${g}, ${b}, ${shadowOpacity})`;
            }
            
            // Remove original shadow properties
            delete cleanedStyle.shadowColor;
            delete cleanedStyle.shadowOffset;
            delete cleanedStyle.shadowOpacity;
            delete cleanedStyle.shadowRadius;
            delete cleanedStyle.elevation;
          }
          
          cleanedStyles[key] = cleanedStyle;
        } else {
          cleanedStyles[key] = style;
        }
      }
    }
    
    return cleanedStyles;
  };
  
  // Override StyleSheet.create
  if (originalStyleSheetCreate) {
    require('react-native-web/dist/exports/StyleSheet/index.js').default.create = (styles) => {
      return originalStyleSheetCreate(cleanStyles(styles));
    };
  }
  
  // Override View component to handle pointerEvents prop
  const originalCreateElement = require('react').createElement;
  require('react').createElement = (type, props, ...children) => {
    if (props && props.pointerEvents && typeof type === 'string') {
      // Convert pointerEvents prop to style
      const newProps = { ...props };
      if (!newProps.style) {
        newProps.style = {};
      } else if (typeof newProps.style === 'object') {
        newProps.style = { ...newProps.style };
      }
      
      newProps.style.pointerEvents = props.pointerEvents;
      delete newProps.pointerEvents;
      
      return originalCreateElement(type, newProps, ...children);
    }
    
    return originalCreateElement(type, props, ...children);
  };
  
  // Additional CSS injection for any remaining issues
  const injectWebStyles = () => {
    if (document.head) {
      const style = document.createElement('style');
      style.id = 'rn-web-fixes';
      style.innerHTML = `
        /* Ensure all elements handle pointer events properly */
        * {
          pointer-events: inherit;
        }
        
        /* Fix for elements with pointer-events styling issues */
        [style*="pointer-events"] {
          pointer-events: inherit !important;
        }
        
        /* Clean up any remaining shadow artifacts */
        .rn-shadow, [class*="shadow"], [style*="shadow"] {
          box-shadow: inherit !important;
        }
        
        /* Fix text rendering in gradients and containers */
        .rn-text, [role="text"] {
          display: inline;
        }
      `;
      
      const existingStyle = document.getElementById('rn-web-fixes');
      if (existingStyle) {
        existingStyle.replaceWith(style);
      } else {
        document.head.appendChild(style);
      }
    }
  };
  
  // Inject styles when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectWebStyles);
  } else {
    injectWebStyles();
  }
}

export default {};