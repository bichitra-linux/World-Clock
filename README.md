# GlobalTime - React Native World Clock App v1.0.1

A clean, functional, and user-friendly World Clock application built with React Native and Expo that allows users to view the current time in multiple cities around the world.

## 🆕 What's New in v1.0.1

- 🌍 **100+ Major Cities** - Expanded city database with comprehensive global coverage
- 🔄 **Time Zone Converter** - Interactive tool to convert time between any two cities
- 🔔 **Notification System** - Schedule time zone alerts and reminders
- ⚙️ **Enhanced Settings** - More customization options including themes and preferences
- ❓ **FAQ & Help** - Comprehensive help section with troubleshooting
- 📊 **Advanced Algorithms** - Binary Search and Merge Sort for optimal performance
- 📱 **Tab Navigation** - Improved navigation with bottom tabs
- 🎨 **Better UI/UX** - More polished interface with Material Design

## Features

### Core Features
- 📱 **Clean Modern UI** - Built with React Native Paper for Material Design components
- 🌍 **100+ World Cities** - Display time for major cities worldwide
- ⏰ **Real-Time Updates** - Clocks update every second with optimized performance
- 🔍 **Smart City Search** - Advanced search with Binary Search algorithm
- 💾 **Persistent Storage** - Save your city preferences using AsyncStorage
- 🗑️ **City Management** - Easy deletion of cities with confirmation dialogs

### New Features in v1.0.1
- 🔄 **Time Zone Converter** - Convert time between any two cities instantly
- 🔔 **Notification System** - Schedule alerts for specific times in different cities
- ⚙️ **Advanced Settings** - Theme selection, sorting options, notification preferences
- ❓ **FAQ & Help** - Comprehensive help section with 20+ questions
- 📄 **Version Information** - Detailed app info, changelog, and credits
- 📊 **Algorithm Integration** - Binary Search (O(log n)) and Merge Sort (O(n log n))

### Technical Features
- ⚡ **Performance Optimized** - Single interval timer for all clocks
- 🧠 **Efficient Re-renders** - Uses React.memo and useMemo for optimal performance
- 🎯 **Clean Architecture** - Well-organized component structure with advanced algorithms
- 📐 **Responsive Design** - Works great on different screen sizes
- 🔍 **Smart Search** - Binary search for exact matches, merge sort for results

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **UI Library**: React Native Paper (Material Design)
- **Time Zone Library**: moment-timezone
- **Storage**: AsyncStorage
- **Notifications**: Expo Notifications
- **Icons**: React Native Vector Icons
- **Package Manager**: Yarn

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- Yarn package manager
- Expo CLI
- Expo Go app on your mobile device (for testing)

### Step-by-Step Setup

1. **Install dependencies**:
   ```cmd
   yarn install
   ```

2. **Install Expo CLI globally** (if not already installed):
   ```cmd
   yarn global add @expo/cli
   ```

3. **Start the development server**:
   ```cmd
   expo start
   ```
   or
   ```cmd
   yarn start
   ```

4. **Run on your device**:
   - Install the Expo Go app on your phone
   - Scan the QR code displayed in your terminal or browser
   - The app will load on your device

### Alternative Running Methods

- **Android Simulator**: `expo start --android`
- **iOS Simulator**: `expo start --ios` (macOS only)
- **Web Browser**: `expo start --web`

## Project Structure

```
GlobalTime/
├── App.js                      # Main app component with navigation
├── src/
│   ├── components/
│   │   └── CityItem.js        # Reusable city display component
│   ├── screens/
│   │   ├── HomeScreen.js      # Main world clock list
│   │   ├── AddCityScreen.js   # City search and selection
│   │   └── SettingsScreen.js  # App settings
│   └── utils/
│       ├── StorageService.js  # AsyncStorage utilities
│       └── TimeService.js     # Time and timezone utilities
├── assets/                    # App assets (icons, splash screens)
├── package.json
├── app.json                   # Expo configuration
└── babel.config.js
```

## Key Implementation Details

### Real-Time Clock Strategy

The app uses a **single setInterval** at the app level (in App.js) that updates every second. This approach:

- ✅ Prevents performance issues from multiple timers
- ✅ Keeps all clocks perfectly synchronized
- ✅ Minimizes battery usage
- ✅ Uses React.memo to prevent unnecessary re-renders of individual city components

```javascript
// Single interval timer in App.js
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);
  return () => clearInterval(interval);
}, []);
```

### Performance Optimizations

1. **Memoized Components**: `CityItem` uses `React.memo` to prevent unnecessary re-renders
2. **Memoized Callbacks**: Search results and event handlers use `useMemo` and `useCallback`
3. **Efficient State Management**: Minimal state updates with focused re-rendering
4. **Optimized Search**: Debounced search with filtered results

### Data Persistence

- **Cities**: User's selected cities are saved to AsyncStorage
- **Settings**: Time format preferences persist between app launches
- **Error Handling**: Graceful fallbacks for storage failures

## Usage

### Adding Cities
1. Tap the "+" button on the home screen
2. Search for a city by typing its name
3. Tap on a city from the suggestions to add it

### Managing Cities
- **Delete**: Tap the trash icon next to any city
- **Confirm**: Deletion requires confirmation to prevent accidental removal

### Settings
- Access via the gear icon in the header
- Toggle between 12-hour and 24-hour time formats
- Settings are automatically saved

## Default Cities

The app comes pre-loaded with these major cities:
- New York, USA
- London, UK
- Tokyo, Japan
- Sydney, Australia
- Dubai, UAE

## Customization

### Adding More Cities
Edit `src/utils/TimeService.js` and add cities to the `SEARCHABLE_CITIES` array:

```javascript
{ name: 'Your City', country: 'Your Country', timezone: 'Your/Timezone' }
```

### Changing the Theme
Modify the theme in `App.js`:

```javascript
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#YOUR_COLOR',
    // ... other colors
  },
};
```

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `expo start --clear`
2. **Dependencies not found**: Run `yarn install`
3. **Expo CLI not found**: Install globally with `yarn global add @expo/cli`

### Performance Issues

If you notice performance problems:
- Ensure you're using the latest version of Expo
- Clear the app cache and restart
- Check that you have sufficient device memory

## Future Enhancements

Potential features for future versions:
- 🌅 Sunrise/sunset times
- 🌡️ Weather integration  
- 📅 Different date formats
- 🎨 Custom themes
- 📊 Time zone converter
- ⏰ World clock widgets

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review the Expo documentation
3. Check React Native Paper documentation
4. Open an issue on the repository

---

**Built with ❤️ using React Native and Expo**