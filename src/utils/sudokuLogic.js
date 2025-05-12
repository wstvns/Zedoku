const GRID_SIZE = 9;
const BOX_SIZE = 3;

// Função para criar uma grade vazia
function createEmptyGrid() {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
}

// Função para verificar se um número é seguro para colocar em uma célula
function isSafe(grid, row, col, num) {
  // Verificar linha
  for (let x = 0; x < GRID_SIZE; x++) {
    if (grid[row][x] === num) {
      return false;
    }
  }

  // Verificar coluna
  for (let x = 0; x < GRID_SIZE; x++) {
    if (grid[x][col] === num) {
      return false;
    }
  }

  // Verificar caixa 3x3
  const startRow = row - (row % BOX_SIZE);
  const startCol = col - (col % BOX_SIZE);
  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      if (grid[i + startRow][j + startCol] === num) {
        return false;
      }
    }
  }
  return true;
}

// Função para preencher a grade de Sudoku (backtrack)
function fillGrid(grid) {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j] === 0) {
        const numbers = shuffleArray([...Array(GRID_SIZE).keys()].map(x => x + 1));
        for (const num of numbers) {
          if (isSafe(grid, i, j, num)) {
            grid[i][j] = num;
            if (fillGrid(grid)) {
              return true;
            }
            grid[i][j] = 0; // Backtrack
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Função para embaralhar um array (Fisher-Yates shuffle, obrigado stackoverflow)
// https://stackoverflow.com/a/12646864
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Função para gerar um novo tabuleiro de Sudoku completo
export function generateSudokuSolution() {
  const grid = createEmptyGrid();
  fillGrid(grid);
  return grid;
}

// Função para criar um quebra-cabeça removendo números
// A dificuldade determina quantos números são removidos.
// Easy: ~35-40 células preenchidas
// Medium: ~30-34 células preenchidas
// Hard: ~25-29 células preenchidas
// Hardcore: ~20-24 células preenchidas
export function createPuzzle(solution, difficulty = 'medium') {
  const puzzle = solution.map(row => [...row]);
  let cellsToRemove;

  switch (difficulty.toLowerCase()) {
    case 'easy':
      cellsToRemove = GRID_SIZE * GRID_SIZE - (Math.floor(Math.random() * 6) + 35); // ~41-46 removidas
      break;
    case 'hard':
      cellsToRemove = GRID_SIZE * GRID_SIZE - (Math.floor(Math.random() * 5) + 25); // ~52-56 removidas
      break;
    case 'hardcore':
      cellsToRemove = GRID_SIZE * GRID_SIZE - (Math.floor(Math.random() * 5) + 20); // ~57-61 removidas
      break;
    case 'medium':
    default:
      cellsToRemove = GRID_SIZE * GRID_SIZE - (Math.floor(Math.random() * 5) + 30); // ~47-51 removidas
      break;
  }

  let attempts = cellsToRemove;
  while (attempts > 0) {
    const row = Math.floor(Math.random() * GRID_SIZE);
    const col = Math.floor(Math.random() * GRID_SIZE);

    if (puzzle[row][col] !== 0) {
      const backup = puzzle[row][col];
      puzzle[row][col] = 0;

      // Para garantir solução única, seria necessário um solver aqui.
      // preciso trabalhar melhor na logica para garantir que o zedokao tenha uma solução única.

      attempts--;
    }
  }
  return puzzle;
}

// Função para verificar se o tabuleiro está completo e correto
export function checkSolution(grid, solution) {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j] === 0 || grid[i][j] !== solution[i][j]) {
        return false;
      }
    }
  }
  return true;
}

// Função para verificar se um movimento é válido 
// com os números já presentes no tabuleiro do jogador.
export function isValidMove(grid, row, col, num) {
    if (num === 0) return true; // Permitir apagar

    // Verificar linha
    for (let x = 0; x < GRID_SIZE; x++) {
        if (x !== col && grid[row][x] === num) {
            return false;
        }
    }

    // Verificar coluna
    for (let x = 0; x < GRID_SIZE; x++) {
        if (x !== row && grid[x][col] === num) {
            return false;
        }
    }

    // Verificar caixa 3x3
    const startRow = row - (row % BOX_SIZE);
    const startCol = col - (col % BOX_SIZE);
    for (let i = 0; i < BOX_SIZE; i++) {
        for (let j = 0; j < BOX_SIZE; j++) {
            if ((i + startRow !== row || j + startCol !== col) && grid[i + startRow][j + startCol] === num) {
                return false;
            }
        }
    }
    return true;
}
