import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Cell from './Cell';

const Board = ({ puzzle, originalPuzzle, notesData, onCellPress, selectedCell, errorCells, colorScheme }) => {
  const styles = getStyles(colorScheme);
  return (
    <View style={styles.board}>
      {puzzle.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((num, colIndex) => {
            let isHighlightedRowCol = false;
            if (selectedCell) {
              if (selectedCell.row === rowIndex || selectedCell.col === colIndex) {
                isHighlightedRowCol = true;
              }
            }
            return (
              <Cell
                key={colIndex}
                number={num}
                notes={notesData && notesData[rowIndex] && notesData[rowIndex][colIndex] ? notesData[rowIndex][colIndex] : []}
                isEditable={originalPuzzle[rowIndex][colIndex] === 0}
                isSelected={selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex}
                isError={errorCells.some(cell => cell.row === rowIndex && cell.col === colIndex)}
                isHighlightedRowCol={isHighlightedRowCol}
                onPress={() => onCellPress(rowIndex, colIndex)}
                rowIndex={rowIndex}
                colIndex={colIndex}
                colorScheme={colorScheme}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const boardSize = windowWidth > 400 ? 360 : windowWidth * 0.9;

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