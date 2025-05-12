import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';

const Cell = ({ number, isEditable, isSelected, onPress, rowIndex, colIndex, colorScheme }) => {
  const styles = getStyles(colorScheme, isEditable, isSelected, number, rowIndex, colIndex);
  return (
    <TouchableOpacity style={styles.cell} onPress={onPress} disabled={!isEditable && number !== 0}>
      <Text style={styles.cellText}>{number !== 0 ? number : ''}</Text>
    </TouchableOpacity>
  );
};

const windowWidth = Dimensions.get('window').width;
const boardSize = windowWidth > 400 ? 360 : windowWidth * 0.9;
const cellSize = boardSize / 9;

const getStyles = (colorScheme, isEditable, isSelected, number, rowIndex, colIndex) => StyleSheet.create({
  cell: {
    width: cellSize,
    height: cellSize,
    borderWidth: 0.5,
    borderColor: colorScheme === 'dark' ? '#555555' : '#999999',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isSelected
      ? (colorScheme === 'dark' ? '#004488' : '#ADD8E6') 
      : isEditable
      ? (colorScheme === 'dark' ? '#333333' : '#FFFFFF') 
      : (colorScheme === 'dark' ? '#222222' : '#EEEEEE'), 
    
    borderTopWidth: (rowIndex % 3 === 0) ? 1.5 : 0.5,
    borderBottomWidth: (rowIndex === 8) ? 1.5 : 0.5,
    borderLeftWidth: (colIndex % 3 === 0) ? 1.5 : 0.5,
    borderRightWidth: (colIndex === 8) ? 1.5 : 0.5, 
    borderColor: colorScheme === 'dark' ? '#777777' : '#333333',
    borderTopColor: (rowIndex % 3 === 0) ? (colorScheme === 'dark' ? '#999999' : '#000000') : (colorScheme === 'dark' ? '#777777' : '#333333'),
    borderBottomColor: (rowIndex === 8 || (rowIndex + 1) % 3 === 0 && rowIndex !== 8) ? (colorScheme === 'dark' ? '#999999' : '#000000') : (colorScheme === 'dark' ? '#777777' : '#333333'),
    borderLeftColor: (colIndex % 3 === 0) ? (colorScheme === 'dark' ? '#999999' : '#000000') : (colorScheme === 'dark' ? '#777777' : '#333333'),
    borderRightColor: (colIndex === 8 || (colIndex + 1) % 3 === 0 && colIndex !== 8) ? (colorScheme === 'dark' ? '#999999' : '#000000') : (colorScheme === 'dark' ? '#777777' : '#333333'),
  },
  cellText: {
    fontSize: cellSize * 0.5,
    fontWeight: isEditable ? 'normal' : 'bold',
    color: isEditable 
      ? (colorScheme === 'dark' ? '#FFFFFF' : '#000000') 
      : (colorScheme === 'dark' ? '#AAAAAA' : '#444444'),
  },
});

export default Cell;
