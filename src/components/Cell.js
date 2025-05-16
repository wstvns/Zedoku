import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Dimensions } from 'react-native';

const Cell = ({ number, notes, isEditable, isSelected, isError, isHighlightedRowCol, onPress, rowIndex, colIndex, colorScheme }) => {
  const styles = getStyles(colorScheme, isEditable, isSelected, isError, isHighlightedRowCol, number, rowIndex, colIndex);

  const renderNotes = () => {
    if (!notes || notes.length === 0) return null;
    const noteGrid = Array(3).fill(null).map(() => Array(3).fill(' '));
    notes.forEach(noteNum => {
      if (noteNum >= 1 && noteNum <= 9) {
        const r = Math.floor((noteNum - 1) / 3);
        const c = (noteNum - 1) % 3;
        noteGrid[r][c] = noteNum;
      }
    });

    return (
      <View style={styles.notesContainer}>
        {noteGrid.map((rowItems, rIndex) => (
          <View key={rIndex} style={styles.noteRow}>
            {rowItems.map((item, cIndex) => (
              <Text key={cIndex} style={styles.noteText}>
                {item}
              </Text>
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <TouchableOpacity style={styles.cell} onPress={onPress} disabled={!isEditable && number !== 0 && (!notes || notes.length === 0)}>
      {number !== 0 ? (
        <Text style={styles.cellText}>{number}</Text>
      ) : (
        renderNotes()
      )}
    </TouchableOpacity>
  );
};

const windowWidth = Dimensions.get('window').width;
const boardSize = windowWidth > 400 ? 360 : windowWidth * 0.9;
const cellSize = boardSize / 9;

const getStyles = (colorScheme, isEditable, isSelected, isError, isHighlightedRowCol, number, rowIndex, colIndex) => StyleSheet.create({
  cell: {
    width: cellSize,
    height: cellSize,
    borderWidth: 0.5,
    borderColor: colorScheme === 'dark' ? '#555555' : '#999999',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isSelected
      ? (colorScheme === 'dark' ? '#005A9C' : '#B3D4FC') 
      : isHighlightedRowCol
      ? (colorScheme === 'dark' ? '#3A3A5A' : '#D6EAF8')
      : isEditable
      ? (colorScheme === 'dark' ? '#333333' : '#FFFFFF')
      : (colorScheme === 'dark' ? '#222222' : '#EEEEEE'),
    borderTopWidth: (rowIndex % 3 === 0) ? 1.5 : 0.5,
    borderBottomWidth: (rowIndex === 8 || (rowIndex + 1) % 3 === 0 && rowIndex !== 8) ? 1.5 : 0.5,
    borderLeftWidth: (colIndex % 3 === 0) ? 1.5 : 0.5,
    borderRightWidth: (colIndex === 8 || (colIndex + 1) % 3 === 0 && colIndex !== 8) ? 1.5 : 0.5,
    borderTopColor: (rowIndex % 3 === 0) ? (colorScheme === 'dark' ? '#999999' : '#000000') : (colorScheme === 'dark' ? '#777777' : '#333333'),
    borderBottomColor: (rowIndex === 8 || (rowIndex + 1) % 3 === 0 && rowIndex !== 8) ? (colorScheme === 'dark' ? '#999999' : '#000000') : (colorScheme === 'dark' ? '#777777' : '#333333'),
    borderLeftColor: (colIndex % 3 === 0) ? (colorScheme === 'dark' ? '#999999' : '#000000') : (colorScheme === 'dark' ? '#777777' : '#333333'),
    borderRightColor: (colIndex === 8 || (colIndex + 1) % 3 === 0 && colIndex !== 8) ? (colorScheme === 'dark' ? '#999999' : '#000000') : (colorScheme === 'dark' ? '#777777' : '#333333'),
  },
  cellText: {
    fontSize: cellSize * 0.5,
    fontWeight: isEditable && number !== 0 ? 'normal' : 'bold',
    color: isError && number !== 0
      ? 'red'
      : isEditable
        ? (colorScheme === 'dark' ? '#FFFFFF' : '#000000')
        : (colorScheme === 'dark' ? '#AAAAAA' : '#444444'),
  },
  notesContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: cellSize * 0.05,
  },
  noteRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  noteText: {
    fontSize: cellSize * 0.18,
    color: colorScheme === 'dark' ? '#CCCCCC' : '#555555',
    textAlign: 'center',
    width: cellSize * 0.25,
    height: cellSize * 0.25,
    lineHeight: cellSize * 0.25,
  },
});

export default Cell;