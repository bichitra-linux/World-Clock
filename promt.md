# Prompt: 
Build a React Native World Clock App
# Objective
Act as a senior React Native developer. Your task is to create a clean, functional, and user-friendly World Clock application. The app should allow users to view the current time in multiple cities around the world.

# Project Name: 
GlobalTime

# Core Technical Stack:

## Framework: 
React Native (using functional components and Hooks)

## Development Platform: 
Expo

## Navigation: 
React Navigation (Stack Navigator)

## Time Zone Library: 
moment-timezone (or date-fns-tz if you prefer a lighter alternative)

## UI Library: 
React Native Paper (for a Material-UI look with pre-built components like List, Appbar, and Searchbar) OR pure React Native styles for a custom design. Your choice.

# Core Features & Requirements:

Home Screen (World Clock List):

Display a list of predefined major cities (e.g., New York, London, Tokyo, Sydney, Dubai).

Each list item should show:

The city name (e.g., "Tokyo, Japan")

The current time in 12-hour (e.g., 2:45 PM) or 24-hour format (user preference, default to 12-hour).

The time difference from the user's local time (e.g., "+14 hrs" or "-5 hrs").

The current date in the target city (e.g., "Mon, Oct 28").

The list should be scrollable.

Add City Screen:

A button on the Home Screen navigates to an "Add City" screen.

This screen features a search bar that allows users to search for a city by name.

As the user types, provide autocomplete suggestions from a predefined list of timezone cities (e.g., using the moment.tz.names() array or a curated list from a cities.json file).

Tapping a city from the suggestions adds it to the list on the Home Screen.

City Management:

The app should persistently save the user's list of chosen cities (using AsyncStorage or Expo's SecureStore).

On the Home Screen, users should be able to delete a city from their list by swiping the list item left/right or via a long-press context menu.

# Real-Time Updates:

The clocks on the Home Screen must update in real-time (every second) to show the live seconds. Important: Optimize this to prevent performance issues. (Hint: Use a single setInterval at the app level, not one per list item).

User Preferences (Optional Stretch Goal):

Include a settings screen (accessible from the header) to toggle between 12-hour and 24-hour time format. This preference should also be saved persistently.

# Quality & Implementation Requirements:

Code Structure: Organize the code logically. Use separate components for the CityItem, AddCityModal, etc.

Styling: Apply clean and modern styling. Ensure sufficient contrast and padding for readability.

Performance: The real-time clock update must be implemented efficiently. Avoid unnecessary re-renders. Use useMemo and useCallback where appropriate.

Error Handling: Include basic error handling for data loading and storage operations.

# Final Output:

Please provide the complete code for this application, including:

The main App.js file setting up navigation and state context (if needed).

All necessary component files (e.g., HomeScreen.js, AddCityScreen.js).

A package.json file listing the required dependencies.

Clear instructions on how to run the app using expo start.

Briefly explain your chosen strategy for handling the real-time clock updates efficiently.

Why this prompt is effective:
Clear Role & Objective: It tells the AI exactly what persona to assume and what the final product should be.

Specified Tech Stack: It eliminates guesswork by naming specific libraries (Expo, React Navigation, Moment.js).

Detailed Feature Breakdown: Each screen and function is described in detail, reducing ambiguity.

Non-Functional Requirements: It addresses critical concerns like performance, styling, and state management.

Defines Output Format: It asks for not just code, but also explanations and setup instructions, making the result much more useful.

Stretch Goals: The "optional" settings screen gives the AI a chance to go above and beyond if its capabilities allow.
