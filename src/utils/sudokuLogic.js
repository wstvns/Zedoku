// se nao fosse a internet, isso aqui seria um arquivo de 2000 linhas
// tudo comentado para nao esquecer tudo que aprendi e nao ter que pesquisar de novo.
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
// Easy: ~35-40 células preenchidas (41-46 removidas)
// Medium: ~30-34 células preenchidas (47-51 removidas)
// Hard: ~25-29 células preenchidas (52-56 removidas)
// Hardcore (Expert): ~17-20 células preenchidas (61-64 removidas)
export function createPuzzle(solution, difficulty = 'medium') {
  const puzzle = solution.map(row => [...row]);
  let cellsToLeave;

  switch (difficulty.toLowerCase()) {
    case 'easy':
      cellsToLeave = Math.floor(Math.random() * 6) + 35; // Deixa 35 a 40 células
      break;
    case 'hard':
      cellsToLeave = Math.floor(Math.random() * 5) + 25; // Deixa 25 a 29 células
      break;
    case 'hardcore': // Modo Expert
      cellsToLeave = Math.floor(Math.random() * 4) + 17; // Deixa 17 a 20 células
      break;
    case 'medium':
    default:
      cellsToLeave = Math.floor(Math.random() * 5) + 30; // Deixa 30 a 34 células
      break;
  }

  let cellsToRemove = GRID_SIZE * GRID_SIZE - cellsToLeave;
  let attempts = cellsToRemove * 2; // Aumentar tentativas para garantir que o número desejado seja removido
  let removedCount = 0;

  // caso eu tente colocar isso aqui em prod, preciso melhorar o algoritmo pra ficar mais robusto
  // e garantir que o número de tentativas não seja tão alto
  // e que o número de células removidas seja o correto
  const cells = [];
  for(let r=0; r<GRID_SIZE; r++) {
    for(let c=0; c<GRID_SIZE; c++) {
        cells.push({r,c});
    }
  }
  shuffleArray(cells); // Embaralhar a ordem de remoção das células

  for(let i=0; i < cells.length && removedCount < cellsToRemove; i++){
    const {r, c} = cells[i];
    if (puzzle[r][c] !== 0) {
        // const backup = puzzle[r][c]; // Para verificar unicidade, precisaria de um solver
        puzzle[r][c] = 0;
        removedCount++;
        // Aqui idealmente teria que chamar uma função hasUniqueSolution(puzzleCopy)
        // Se não tiver solução única, puzzle[r][c] = backup; e removedCount--;
        // mas isso é complexo e não está implementado
        // para simplicficar, vamos assumir que a remoção é válida kk
    }
  }

  // Se nao tiver removido o suficiente, tem que tentar de novo
  // Mas para esta simplificação vamos deixar assim e que o shuffle faça o trabalho

  return puzzle;
}

// Função para verificar se o tabuleiro está completo e correto
export function checkSolution(grid, solution) {
  if (!grid || !solution) return false;
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

// enfim, isso aqui precisa de muito mais trabalho
// mas por enquanto é só pra ter uma ideia de como funciona
// e como eu posso fazer isso em react
// os comentarios sao para minha pessoa
// e para quem for ler isso depois
// e para o futuro eu mesmo (y)