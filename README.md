# AuroFit

A comprehensive fitness and wellness tracking app built with React Native and Expo, designed to help users maintain a healthy lifestyle through exercise tracking, daily tips, and personalized wellness features.

## Features

### 🏋️ Exercise Tracking
- Browse exercises by categories (Popular, Stretching, Cardio, Bodyweight, Strength)
- View detailed exercise information with images and descriptions
- Log workouts with customizable sets, reps, weight, duration, and notes
- Track workout history and progress

### ❤️ Favorites System
- Mark exercises as favorites for quick access
- Dedicated favorites screen for easy workout planning
- Persistent storage of favorite exercises

### 💧 Water Tracking
- Daily water intake monitoring
- Customizable water goals and settings
- Visual progress tracking with charts

### 🌙 Dark Mode Support
- Automatic dark/light mode detection
- Consistent theming across all screens
- Optimized UI for both color schemes

### 📱 Daily Wellness Tips
- Categorized wellness tips (Fitness, Nutrition, Mental Health, Recovery)
- Daily tip rotation for motivation and education
- Beautiful gradient backgrounds and themed text

### 🎨 Modern UI/UX
- Glass morphism effects and gradients
- Smooth animations and transitions
- Responsive design for different screen sizes
- Themed components for consistent styling

### 🔐 User Authentication
- Secure user login and registration
- Persistent session management with encrypted storage
- Protected routes and user-specific data

## Technologies Used

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and runtime
- **TypeScript** - Type-safe JavaScript
- **expo-router** - File-based routing system (built on React Navigation)
- **React Navigation** - Underlying navigation library used by expo-router
- **Redux Toolkit** - Modern state management with simplified Redux
- **AsyncStorage** - Local data persistence
- **expo-linear-gradient** - Gradient backgrounds
- **API-Ninjas** - Exercise data API (https://api-ninjas.com/api/exercises)
- **DummyJSON** - Authentication API for demo purposes (https://dummyjson.com/)

## Project Structure

```
app/
├── _layout.tsx          # Root layout with navigation setup
├── modal.tsx           # Modal screens
├── (tabs)/             # Tab group for bottom navigation
│   ├── _layout.tsx     # Tab navigation layout
│   ├── index.tsx       # Home screen (/)
│   ├── favorites.tsx   # Favorite exercises (/favorites)
│   ├── workouts.tsx    # Workout history (/workouts)
│   └── settings.tsx    # account preferences (/settings)
├── constants/
│   └── theme.ts        # App theming constants
├── components/
│   ├── ui/            # Reusable UI components
│   ├── wellness-card.tsx    # Exercise card component
│   ├── log-workout-modal.tsx # Workout logging modal
│   ├── water-tracker.tsx     # Water intake tracker
│   └── themed-text.tsx       # Themed text component
├── hooks/             # Custom React hooks
├── src/
│   ├── services/      # Business logic services
│   ├── types/         # TypeScript type definitions
│   ├── contexts/      # React contexts
│   └── config/        # Configuration files
└── assets/            # Images and static assets
```

*Note: File paths in the `app/` directory automatically become routes (e.g., `app/favorites.tsx` becomes `/favorites`)*

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SachiniKalansooriya/AuroFit.git
   cd AuroFit
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory and add your API key:
   ```env
   EXPO_PUBLIC_API_NINJAS_KEY=your_api_ninjas_key_here
   ```
   
   Get your free API key from [API-Ninjas](https://api-ninjas.com/api/exercises)

4. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/emulator**
   - For iOS: Press `i` in the terminal or scan QR code with Camera app
   - For Android: Press `a` in the terminal or scan QR code with Expo Go app
   - For web: Press `w` in the terminal

### Development Commands

- `npx expo start` - Start the Expo development server
- `npx expo start --clear` - Clear cache and start fresh
- `npx tsc --noEmit` - Run TypeScript type checking
- `npx expo build:android` - Build for Android
- `npx expo build:ios` - Build for iOS

### Key Components

### Services Layer
- **WellnessService** - Manages exercise data and categories (uses API-Ninjas)
- **FavoritesService** - Handles favorite exercises persistence
- **WorkoutService** - Manages workout logging and history

### Authentication & Context
- **AuthContext** - Manages user authentication state and session
- **SecureStore** - Encrypted local storage for user credentials
- Route protection based on authentication status

### UI Components
- **WellnessCard** - Reusable exercise card with favorite/log functionality
- **LogWorkoutModal** - Modal for logging workout details
- **WaterTracker** - Water intake monitoring component
- **ThemedText/ThemedView** - Theme-aware text and view components

### State Management
- **Redux Toolkit** - Modern Redux with simplified setup and less boilerplate
- **Water tracking state** - Complex water intake data with weekly history and statistics
- **Async operations** - Thunks for API calls and data persistence
- **TypeScript integration** - Strongly typed actions, reducers, and selectors

### Navigation
- File-based routing with expo-router (Next.js-style routing)
- Bottom tab navigation for main screens
- Stack navigation for detailed views and modals
- Automatic route generation from file structure

## External APIs

### API-Ninjas Exercise API
- **Purpose**: Provides comprehensive exercise database with detailed information
- **Features**: 
  - Exercise search by muscle group, type, and difficulty
  - Detailed exercise instructions and equipment requirements
  - Multiple exercise categories (strength, cardio, stretching, etc.)
- **Usage**: Fetches exercise data dynamically for the app's workout features
- **Rate Limits**: Free tier available with reasonable limits for development
- **Documentation**: https://api-ninjas.com/api/exercises

### DummyJSON Authentication API
- **Purpose**: Demo authentication service for user login and registration
- **Features**:
  - User authentication with username/password
  - User registration with profile creation
  - Mock user data for testing purposes
- **Usage**: Handles user authentication and session management
- **Endpoints Used**:
  - `POST /auth/login` - User login
  - `POST /users/add` - User registration
- **Documentation**: https://dummyjson.com/docs/auth

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **API-Ninjas** - Exercise database API providing comprehensive fitness data
- **DummyJSON** - Mock authentication API for demo purposes
- Exercise data and images sourced from API-Ninjas exercise database
- Icons provided by SF Symbols and custom assets
- UI inspiration from modern fitness and wellness apps
