import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, Button, Alert, Dimensions, TouchableOpacity, Appearance, Switch } from 'react-native';
import Board from './Board';
import { generateSudokuSolution, createPuzzle, isValidMove, checkSolution } from '../utils/sudokuLogic';

const GameScreen = () => {
  const [solution, setSolution] = useState(null);
  const [puzzle, setPuzzle] = useState(null);
  const [workingPuzzle, setWorkingPuzzle] = useState(null);
  const [notesData, setNotesData] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [lives, setLives] = useState(3);
  const [hints, setHints] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
  const [errorCells, setErrorCells] = useState([]);
  const [isNotesMode, setIsNotesMode] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const timerRef = useRef(null);

  const initializeNotes = () => Array(9).fill(null).map(() => Array(9).fill(null).map(() => []));

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
      setColorScheme(newColorScheme);
    });
    return () => subscription.remove();
  }, []);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    stopTimer();
    setTimeElapsed(0);
    timerRef.current = setInterval(() => {
      setTimeElapsed(prevTime => prevTime + 1);
    }, 1000);
  };

  const initializeNewGame = useCallback((level) => {
    const newSolution = generateSudokuSolution();
    const newPuzzle = createPuzzle(newSolution, level);
    setSolution(newSolution);
    setPuzzle(newPuzzle.map(row => [...row]));
    setWorkingPuzzle(newPuzzle.map(row => [...row]));
    setNotesData(initializeNotes());
    setSelectedCell(null);
    setLives(3);
    setHints(3);
    setIsGameOver(false);
    setIsGameWon(false);
    setDifficulty(level);
    setErrorCells([]);
    setIsNotesMode(false);
    startTimer();
  }, []);

  useEffect(() => {
    initializeNewGame(difficulty);
    return () => stopTimer();
  }, [initializeNewGame, difficulty]);

  useEffect(() => {
    if (isGameOver || isGameWon) {
      stopTimer();
    }
  }, [isGameOver, isGameWon]);

  const handleCellPress = (row, col) => {
    if (puzzle && puzzle[row][col] !== 0 && !isNotesMode) {
      setSelectedCell(null);
      return;
    }
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (number) => {
    if (!selectedCell || !workingPuzzle || isGameOver || isGameWon) return;
    const { row, col } = selectedCell;
    if (puzzle[row][col] !== 0 && !isNotesMode) return;

    if (isNotesMode) {
      if (number === 0) {
        const newNotesData = notesData.map(r => r.map(c => [...c]));
        newNotesData[row][col] = [];
        setNotesData(newNotesData);
      } else {
        const newNotesData = notesData.map(r => r.map(c => [...c]));
        const currentNotes = newNotesData[row][col];
        const noteIndex = currentNotes.indexOf(number);
        if (noteIndex > -1) {
          currentNotes.splice(noteIndex, 1);
        } else {
          currentNotes.push(number);
          currentNotes.sort((a, b) => a - b);
        }
        newNotesData[row][col] = currentNotes;
        setNotesData(newNotesData);
        if (workingPuzzle[row][col] !== 0) {
            const newWorkingPuzzle = workingPuzzle.map(arr => [...arr]);
            newWorkingPuzzle[row][col] = 0;
            setWorkingPuzzle(newWorkingPuzzle);
        }
      }
    } else {
      const newWorkingPuzzle = workingPuzzle.map(arr => [...arr]);
      newWorkingPuzzle[row][col] = number;
      const newNotesData = notesData.map(r => r.map(c => [...c]));
      newNotesData[row][col] = [];
      setNotesData(newNotesData);
      let currentErrorCells = [...errorCells];
      currentErrorCells = currentErrorCells.filter(cell => !(cell.row === row && cell.col === col));
      if (number !== 0) {
        const isMoveCurrentlyValid = isValidMove(newWorkingPuzzle, row, col, number);
        const isNumberCorrect = solution && solution[row][col] === number;
        if (!isMoveCurrentlyValid || !isNumberCorrect) {
          if (!currentErrorCells.find(cell => cell.row === row && cell.col === col)) {
            currentErrorCells.push({ row, col });
          }
          if (!isNumberCorrect) {
            setLives(prevLives => {
              const newLives = prevLives - 1;
              if (newLives <= 0) {
                setIsGameOver(true);
                Alert.alert("Game Over!", "Você ficou sem vidas.");
              }
              return newLives;
            });
          }
        }
        if (checkSolution(newWorkingPuzzle, solution)) {
          setIsGameWon(true);
          Alert.alert("Parabéns!", "Você resolveu o Zédoku!");
          setErrorCells([]);
        }
      }
      setErrorCells(currentErrorCells);
      setWorkingPuzzle(newWorkingPuzzle);
    }
  };

  const handleHint = () => {
    if (isGameOver || isGameWon) return;
    if (hints <= 0) {
      Alert.alert("Sem Dicas", "Você não tem mais dicas disponíveis.");
      return;
    }
    if (!workingPuzzle || !solution) return;
    const emptyCells = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (workingPuzzle[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }
    if (emptyCells.length === 0) {
      Alert.alert("Tabuleiro Cheio", "Não há células vazias para dar uma dica.");
      return;
    }
    const randomEmptyCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const { r, c } = randomEmptyCell;
    const correctNumber = solution[r][c];
    const newWorkingPuzzle = workingPuzzle.map(arr => [...arr]);
    newWorkingPuzzle[r][c] = correctNumber;
    setWorkingPuzzle(newWorkingPuzzle);
    setHints(prevHints => prevHints - 1);
    const newNotesData = notesData.map(notesRow => notesRow.map(notesCell => [...notesCell]));
    newNotesData[r][c] = [];
    setNotesData(newNotesData);
    setErrorCells(prevErrorCells => prevErrorCells.filter(cell => !(cell.row === r && cell.col === c)));
    if (checkSolution(newWorkingPuzzle, solution)) {
      setIsGameWon(true);
      Alert.alert("Parabéns!", "Você resolveu o Zédoku!");
      setErrorCells([]);
    }
  };

  const startNewGameWithDifficulty = (level) => {
    initializeNewGame(level);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const styles = getStyles(colorScheme);

  if (!workingPuzzle || !notesData) {
    return <View style={styles.container}><Text style={styles.loadingText}>Carregando...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.difficultyText}>Dificuldade: {difficulty}</Text>
        <Text style={styles.timerText}>Tempo: {formatTime(timeElapsed)}</Text>
        <Text style={styles.livesText}>Vidas: {lives}</Text>
        <Text style={styles.hintsText}>Dicas: {hints}</Text>
      </View>
      <View style={styles.difficultyButtons}>
        <Button title="Fácil" onPress={() => startNewGameWithDifficulty('easy')} color={difficulty === 'easy' ? (colorScheme === 'dark' ? '#4CAF50' : '#66BB6A') : (colorScheme === 'dark' ? '#333333' : '#2196F3')} />
        <Button title="Médio" onPress={() => startNewGameWithDifficulty('medium')} color={difficulty === 'medium' ? (colorScheme === 'dark' ? '#4CAF50' : '#66BB6A') : (colorScheme === 'dark' ? '#333333' : '#2196F3')} />
        <Button title="Difícil" onPress={() => startNewGameWithDifficulty('hard')} color={difficulty === 'hard' ? (colorScheme === 'dark' ? '#4CAF50' : '#66BB6A') : (colorScheme === 'dark' ? '#333333' : '#2196F3')} />
        <Button title="Expert" onPress={() => startNewGameWithDifficulty('hardcore')} color={difficulty === 'hardcore' ? (colorScheme === 'dark' ? '#4CAF50' : '#66BB6A') : (colorScheme === 'dark' ? '#333333' : '#2196F3')} />
      </View>
      <Board
        puzzle={workingPuzzle}
        originalPuzzle={puzzle}
        notesData={notesData}
        onCellPress={handleCellPress}
        selectedCell={selectedCell}
        errorCells={errorCells}
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
      <View style={styles.actionButtons}>
        <Button title="Dica" onPress={handleHint} disabled={hints <= 0 || isGameOver || isGameWon} color={colorScheme === 'dark' ? '#FFC107' : '#FFEB3B'} />
        <View style={styles.switchContainer}>
            <Text style={styles.notesModeText}>Modo Notas:</Text>
            <Switch 
                trackColor={{ false: "#767577", true: colorScheme === 'dark' ? "#81b0ff" : "#81b0ff" }}
                thumbColor={isNotesMode ? (colorScheme === 'dark' ? "#f5dd4b" : "#f4f3f4") : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => setIsNotesMode(previousState => !previousState)}
                value={isNotesMode}
            />
        </View>
      </View>
      {isGameOver && <Text style={styles.gameOverText}>GAME OVER</Text>}
      {isGameWon && <Text style={styles.gameWonText}>VOCÊ VENCEU!</Text>}
    </View>
  );
};

const getStyles = (colorScheme) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5, // padding ajustado
    backgroundColor: colorScheme === 'dark' ? '#121212' : '#f0f0f0',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '95%',
    marginBottom: 5,
    paddingHorizontal: 0,
  },
  difficultyText: {
    fontSize: 12,
    color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
  },
  timerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
  },
  livesText: {
    fontSize: 12,
    color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
  },
  hintsText: {
    fontSize: 12,
    color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
  },
  difficultyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '95%',
    marginBottom: 10,
  },
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
    width: Dimensions.get('window').width > 380 ? 320 : '90%',
  },
  numButton: {
    width: Dimensions.get('window').width > 380 ? 45 : 35,
    height: Dimensions.get('window').width > 380 ? 45 : 35,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    backgroundColor: colorScheme === 'dark' ? '#333333' : '#DDDDDD',
    borderRadius: 5,
  },
  numButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colorScheme === 'dark' ? '#FFFFFF' : '#000000'
  },
  actionButtons: {
    marginTop: 10,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notesModeText: {
    fontSize: 14,
    marginRight: 5,
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