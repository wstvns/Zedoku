import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Button, Alert, Dimensions, TouchableOpacity, Appearance } from 'react-native';
import Board from './Board';
import { generateSudokuSolution, createPuzzle, isValidMove, checkSolution } from '../utils/sudokuLogic';

const GameScreen = () => {
  const [solution, setSolution] = useState(null);
  const [puzzle, setPuzzle] = useState(null);
  const [workingPuzzle, setWorkingPuzzle] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null); 
  const [difficulty, setDifficulty] = useState('medium'); 
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
      setColorScheme(newColorScheme);
    });
    return () => subscription.remove();
  }, []);

  const initializeNewGame = useCallback((level) => {
    const newSolution = generateSudokuSolution();
    const newPuzzle = createPuzzle(newSolution, level);
    setSolution(newSolution);
    setPuzzle(newPuzzle.map(row => [...row]));
    setWorkingPuzzle(newPuzzle.map(row => [...row]));
    setSelectedCell(null);
    setLives(3);
    setIsGameOver(false);
    setIsGameWon(false);
    setDifficulty(level);
  }, []);

  useEffect(() => {
    initializeNewGame(difficulty);
  }, [initializeNewGame, difficulty]);

  const handleCellPress = (row, col) => {
    if (puzzle && puzzle[row][col] !== 0) {
      // numeros nao podem ser alterados 
      setSelectedCell(null);
      return;
    }
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (number) => {
    if (!selectedCell || !workingPuzzle || isGameOver || isGameWon) return;

    const { row, col } = selectedCell;

    // previne a mudanca de numeros em celulas que ja possuem um valor
    if (puzzle[row][col] !== 0) return;

    const newWorkingPuzzle = workingPuzzle.map(arr => [...arr]);
    newWorkingPuzzle[row][col] = number;

    if (number !== 0 && !isValidMove(newWorkingPuzzle, row, col, number)) {
      setLives(prevLives => prevLives - 1);
      if (lives - 1 <= 0) {
        setIsGameOver(true);
        Alert.alert("Game Over!", "Você ficou sem vidas.");
      }
    } 
    // logica para verificar se o jogo foi ganho
    // e se o número inserido é diferente de 0
    if (number !== 0 && checkSolution(newWorkingPuzzle, solution)) {
        setIsGameWon(true);
        Alert.alert("Parabéns!", "Você resolveu o Zédoku!");
    }
    
    setWorkingPuzzle(newWorkingPuzzle);
  };

  const startNewGameWithDifficulty = (level) => {
    initializeNewGame(level);
  };
  
  const styles = getStyles(colorScheme);

  if (!workingPuzzle) {
    return <View style={styles.container}><Text style={styles.loadingText}>Carregando...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sudoku</Text>
      <View style={styles.difficultyButtons}>
        <Button title="Fácil" onPress={() => startNewGameWithDifficulty('easy')} color={difficulty === 'easy' ? '#4CAF50' : '#2196F3'} />
        <Button title="Médio" onPress={() => startNewGameWithDifficulty('medium')} color={difficulty === 'medium' ? '#4CAF50' : '#2196F3'} />
        <Button title="Difícil" onPress={() => startNewGameWithDifficulty('hard')} color={difficulty === 'hard' ? '#4CAF50' : '#2196F3'} />
        <Button title="Expert" onPress={() => startNewGameWithDifficulty('hardcore')} color={difficulty === 'hardcore' ? '#4CAF50' : '#2196F3'} />
      </View>
      <Board 
        puzzle={workingPuzzle} 
        originalPuzzle={puzzle} 
        onCellPress={handleCellPress} 
        selectedCell={selectedCell} 
        colorScheme={colorScheme}
      />
      <View style={styles.controls}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <TouchableOpacity key={num} style={styles.numButton} onPress={() => handleNumberInput(num)}>
            <Text style={styles.numButtonText}>{num}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.numButton} onPress={() => handleNumberInput(0)}>
            <Text style={styles.numButtonText}>X</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.livesText}>Vidas: {lives}</Text>
      {isGameOver && <Text style={styles.gameOverText}>GAME OVER</Text>}
      {isGameWon && <Text style={styles.gameWonText}>VOCÊ VENCEU!</Text>}
      <Button title="Novo Jogo (Atual)" onPress={() => initializeNewGame(difficulty)} />
    </View>
  );
};

const getStyles = (colorScheme) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50, // barra de status
    backgroundColor: colorScheme === 'dark' ? '#121212' : '#f0f0f0',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
  },
  difficultyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: 10,
  },
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
    width: Dimensions.get('window').width > 380 ? 360 : '95%',
  },
  numButton: {
    width: Dimensions.get('window').width > 380 ? 60 : 50,
    height: Dimensions.get('window').width > 380 ? 60 : 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    backgroundColor: colorScheme === 'dark' ? '#333333' : '#DDDDDD',
    borderRadius: 5,
  },
  numButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
  },
  livesText: {
    fontSize: 18,
    marginTop: 10,
    color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
  },
  gameOverText: {
    fontSize: 24,
    color: 'red',
    fontWeight: 'bold',
    marginTop: 10,
  },
  gameWonText: {
    fontSize: 24,
    color: 'green',
    fontWeight: 'bold',
    marginTop: 10,
  },
  loadingText: {
    fontSize: 18,
    color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
  }
});

export default GameScreen;