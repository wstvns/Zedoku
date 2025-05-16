import React from 'react';
import { View, Text, Button, StyleSheet, Appearance } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const colorScheme = Appearance.getColorScheme();
  const styles = getStyles(colorScheme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sudoku</Text>
      <View style={styles.buttonContainer}>
        <Button 
          title="Novo Jogo" 
          onPress={() => navigation.navigate('Game')} 
          color={colorScheme === 'dark' ? '#4CAF50' : '#2196F3'}
        />
      </View>
      {/* Reservar para futuros updates, como estatistica, opcoes etc*/}
      {/* 
      <View style={styles.buttonContainer}>
        <Button 
          title="Opções" 
          onPress={() => Alert.alert("Opções", "Funcionalidade a ser implementada.")} 
          color={colorScheme === 'dark' ? '#607D8B' : '#795548'}
        />
      </View>
      */}
    </View>
  );
};

const getStyles = (colorScheme) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colorScheme === 'dark' ? '#121212' : '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 60,
    color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
  },
  buttonContainer: {
    marginVertical: 10,
    width: '80%',
  },
});

export default HomeScreen;

