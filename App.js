import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/components/HomeScreen';
import GameScreen from './src/components/GameScreen';
import { Appearance } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  const colorScheme = Appearance.getColorScheme();

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFFFFF',
          },
          headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Sudoku - Menu Principal' }} 
        />
        <Stack.Screen 
          name="Game" 
          component={GameScreen} 
          options={{ title: 'Sudoku - Em Jogo' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}