const cells = Array.from(document.querySelectorAll('.cell'));
const statusEl = document.getElementById('status');
const playerScoreEl = document.getElementById('player-score');
const drawScoreEl = document.getElementById('draw-score');
const botScoreEl = document.getElementById('bot-score');
const restartBtn = document.getElementById('restartBtn');

const ASSET_PATHS = {
  X: '../assets/x.svg',
  O: '../assets/o.svg',
};

const state = {
  board: Array(9).fill(''),
  player: 'X',
  bot: 'O',
  currentTurn: 'X',
  scores: {
    player: 0,
    draw: 0,
    bot: 0,
  },
  gameOver: false,
};

function renderMark(cell, mark) {
  if (!mark) {
    cell.innerHTML = '';
    return;
  }

  const src = ASSET_PATHS[mark];
  cell.innerHTML = `<img src="${src}" alt="${mark}" aria-label="${mark}" />`;
}

function updateScoreboard() {
  playerScoreEl.textContent = String(state.scores.player);
  drawScoreEl.textContent = String(state.scores.draw);
  botScoreEl.textContent = String(state.scores.bot);
}

function updateStatus(message) {
  statusEl.textContent = message;
}

function resetBoard() {
  state.board = Array(9).fill('');
  state.currentTurn = 'X';
  state.gameOver = false;

  cells.forEach((cell) => {
    renderMark(cell, '');
    cell.disabled = false;
  });

  updateStatus('Sua vez: X');
}

function checkWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

function finishRound(winner) {
  state.gameOver = true;

  cells.forEach((cell) => {
    cell.disabled = true;
  });

  if (winner === 'X') {
    state.scores.player += 1;
    updateStatus('Você venceu!');
  } else if (winner === 'O') {
    state.scores.bot += 1;
    updateStatus('O bot venceu!');
  } else {
    state.scores.draw += 1;
    updateStatus('Empate!');
  }

  updateScoreboard();
}

function isBoardFull(board) {
  return board.every((cell) => cell !== '');
}

function canPlay(index) {
  return !state.gameOver && state.board[index] === '' && state.currentTurn === 'X';
}

function makePlayerMove(index) {
  if (!canPlay(index)) return;

  state.board[index] = 'X';
  renderMark(cells[index], 'X');
  cells[index].disabled = true;

  const winner = checkWinner(state.board);
  if (winner) {
    finishRound(winner);
    return;
  }

  if (isBoardFull(state.board)) {
    finishRound(null);
    return;
  }

  state.currentTurn = 'O';
  updateStatus('Turno do bot...');
  setTimeout(makeBotMove, 500);
}

function getBestMove(board) {
  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of winningLines) {
    if (board[a] === 'O' && board[b] === 'O' && board[c] === '') return c;
    if (board[a] === 'O' && board[c] === 'O' && board[b] === '') return b;
    if (board[b] === 'O' && board[c] === 'O' && board[a] === '') return a;
  }

  for (const [a, b, c] of winningLines) {
    if (board[a] === 'X' && board[b] === 'X' && board[c] === '') return c;
    if (board[a] === 'X' && board[c] === 'X' && board[b] === '') return b;
    if (board[b] === 'X' && board[c] === 'X' && board[a] === '') return a;
  }

  const center = 4;
  if (board[center] === '') return center;

  const corners = [0, 2, 6, 8].filter((index) => board[index] === '');
  if (corners.length > 0) return corners[0];

  return board.findIndex((cell) => cell === '');
}

function makeBotMove() {
  if (state.gameOver) return;

  const move = getBestMove(state.board);
  if (move === -1) return;

  state.board[move] = 'O';
  renderMark(cells[move], 'O');
  cells[move].disabled = true;

  const winner = checkWinner(state.board);
  if (winner) {
    finishRound(winner);
    return;
  }

  if (isBoardFull(state.board)) {
    finishRound(null);
    return;
  }

  state.currentTurn = 'X';
  updateStatus('Sua vez: X');
}

cells.forEach((cell) => {
  cell.addEventListener('click', () => {
    const index = Number(cell.dataset.index);
    makePlayerMove(index);
  });
});

restartBtn.addEventListener('click', () => {
  resetBoard();
  updateScoreboard();
});

updateScoreboard();
resetBoard();
