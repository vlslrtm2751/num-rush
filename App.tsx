import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

import { GameProvider } from './src/context/GameContext';
import { SoundProvider } from './src/context/SoundContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { GameScreen } from './src/screens/GameScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { LeaderboardScreen } from './src/screens/LeaderboardScreen';

export type RootStackParamList = {
  Home: undefined;
  Game: undefined;
  Result: undefined;
  Leaderboard: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <GameProvider>
        <SoundProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: '#0D1B2A' },
              }}
            >
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Game" component={GameScreen} />
              <Stack.Screen name="Result" component={ResultScreen} />
              <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
            </Stack.Navigator>
          </NavigationContainer>
          <StatusBar style="light" />
        </SoundProvider>
      </GameProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
