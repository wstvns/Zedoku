import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Cell from './Cell';

const Board = ({ puzzle, originalPuzzle, onCellPress, selectedCell, colorScheme }) => {
  const styles = getStyles(colorScheme);
  return (
    <View style={styles.board}>
      {puzzle.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((num, colIndex) => (
            <Cell
              key={colIndex}
              number={num}
              isEditable={originalPuzzle[rowIndex][colIndex] === 0}
              isSelected={selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex}
              onPress={() => onCellPress(rowIndex, colIndex)}
              rowIndex={rowIndex}
              colIndex={colIndex}
              colorScheme={colorScheme}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const boardSize = windowWidth > 400 ? 360 : windowWidth * 0.9;
const cellSize = boardSize / 9;

const getStyles = (colorScheme) => StyleSheet.create({
  board: {
    width: boardSize,
    height: boardSize,
    borderWidth: 2,
    borderColor: colorScheme === 'dark' ? '#999999' : '#333',
    flexDirection: 'column',
    backgroundColor: colorScheme === 'dark' ? '#1e1e1e' : '#FFFFFF',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default Board;