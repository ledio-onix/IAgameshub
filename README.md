const navButtons = document.querySelectorAll('.nav-btn');
const panels = document.querySelectorAll('.game-panel');

navButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.dataset.game;

    navButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
    panels.forEach((panel) => {
      panel.classList.toggle('active-panel', panel.id === target);
    });
  });
});

const velhState = {
  board: Array(9).fill(''),
  currentPlayer: 'X',
  scores: { X: 0, O: 0 },
  gameOver: false,
};

const boardEl = document.getElementById('board');
const velhaStatus = document.getElementById('velha-status');
const scoreX = document.getElementById('score-x');
const scoreO = document.getElementById('score-o');
const restartVelha = document.getElementById('restart-velha');

function updateVelhaScore() {
  scoreX.textContent = velhState.scores.X;
  scoreO.textContent = velhState.scores.O;
}

function checkWinner(board) {
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
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

function resetVelhaBoard() {
  velhState.board = Array(9).fill('');
  velhState.currentPlayer = 'X';
  velhState.gameOver = false;

  boardEl.querySelectorAll('.cell').forEach((cell) => {
    cell.textContent = '';
    cell.disabled = false;
  });

  velhaStatus.textContent = 'Vez do jogador X';
}

function finishVelhaRound(winner) {
  velhState.gameOver = true;

  if (winner) {
    velhState.scores[winner] += 1;
    updateVelhaScore();
    velhaStatus.textContent = `Jogador ${winner} venceu!`;
  } else {
    velhaStatus.textContent = 'Empate!';
  }

  boardEl.querySelectorAll('.cell').forEach((cell) => {
    cell.disabled = true;
  });
}

function handleVelhaClick(event) {
  const cell = event.currentTarget;
  const index = Number(cell.dataset.index);

  if (velhState.board[index] || velhState.gameOver) {
    return;
  }

  velhState.board[index] = velhState.currentPlayer;
  cell.textContent = velhState.currentPlayer;
  cell.disabled = true;

  const winner = checkWinner(velhState.board);
  if (winner) {
    finishVelhaRound(winner);
    return;
  }

  if (velhState.board.every(Boolean)) {
    finishVelhaRound(null);
    return;
  }

  velhState.currentPlayer = velhState.currentPlayer === 'X' ? 'O' : 'X';
  velhaStatus.textContent = `Vez do jogador ${velhState.currentPlayer}`;
}

boardEl.querySelectorAll('.cell').forEach((cell) => {
  cell.addEventListener('click', handleVelhaClick);
});

restartVelha.addEventListener('click', () => {
  resetVelhaBoard();
});

updateVelhaScore();

const memoryState = {
  cards: ['🍉', '🍋', '🍇', '🍒', '🍓', '🍍', '🥝', '🍊'],
  deck: [],
  flipped: [],
  matchedPairs: 0,
  moves: 0,
  lockBoard: false,
};

const memoryGrid = document.getElementById('memory-grid');
const memoriaMovimentos = document.getElementById('memoria-movimentos');
const restartMemoria = document.getElementById('restart-memoria');

function buildMemoryDeck() {
  const values = [...memoryState.cards, ...memoryState.cards];
  return [...values].sort(() => Math.random() - 0.5);
}

function renderMemoryBoard() {
  memoryGrid.innerHTML = '';

  memoryState.deck.forEach((value, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'memory-card';
    button.dataset.index = index;
    button.dataset.value = value;
    button.setAttribute('aria-label', `Carta ${index + 1}`);
    button.textContent = '';
    button.addEventListener('click', () => handleMemoryClick(button, value, index));
    memoryGrid.appendChild(button);
  });
}

function revealCard(card, value, isVisible = true) {
  card.textContent = isVisible ? value : '';
  card.classList.toggle('revealed', isVisible);
}

function resetMemoryState() {
  memoryState.deck = buildMemoryDeck();
  memoryState.flipped = [];
  memoryState.matchedPairs = 0;
  memoryState.moves = 0;
  memoryState.lockBoard = false;
  memoriaMovimentos.textContent = '0';
  renderMemoryBoard();
}

function handleMemoryClick(card, value, index) {
  if (memoryState.lockBoard || card.classList.contains('matched') || memoryState.flipped.includes(index)) {
    return;
  }

  revealCard(card, value, true);
  memoryState.flipped.push(index);

  if (memoryState.flipped.length === 2) {
    memoryState.moves += 1;
    memoriaMovimentos.textContent = String(memoryState.moves);

    const [firstIndex, secondIndex] = memoryState.flipped;
    const firstCard = memoryGrid.querySelector(`[data-index="${firstIndex}"]`);
    const secondCard = memoryGrid.querySelector(`[data-index="${secondIndex}"]`);
    const firstValue = firstCard.dataset.value;
    const secondValue = secondCard.dataset.value;

    if (firstValue === secondValue) {
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      memoryState.flipped = [];
      memoryState.matchedPairs += 1;

      if (memoryState.matchedPairs === memoryState.cards.length) {
        memoriaMovimentos.textContent = `${memoryState.moves} movimentos — parabéns!`;
      }
    } else {
      memoryState.lockBoard = true;
      setTimeout(() => {
        revealCard(firstCard, firstValue, false);
        revealCard(secondCard, secondValue, false);
        memoryState.flipped = [];
        memoryState.lockBoard = false;
      }, 700);
    }
  }
}

restartMemoria.addEventListener('click', resetMemoryState);
resetMemoryState();

const guessState = {
  secretNumber: null,
  attempts: 0,
  best: null,
};

const guessInput = document.getElementById('guess-input');
const guessBtn = document.getElementById('guess-btn');
const guessStatus = document.getElementById('adivinha-status');
const attemptsEl = document.getElementById('adivinha-tentativas');
const bestEl = document.getElementById('adivinha-melhor');
const restartAdivinha = document.getElementById('restart-adivinha');

function newRound() {
  guessState.secretNumber = Math.floor(Math.random() * 100) + 1;
  guessState.attempts = 0;
  guessInput.value = '';
  guessStatus.textContent = 'Aguardando sua primeira tentativa.';
  attemptsEl.textContent = '0';
  guessInput.focus();
}

function updateBest() {
  if (guessState.best === null) {
    bestEl.textContent = '—';
  } else {
    bestEl.textContent = String(guessState.best);
  }
}

function checkGuess() {
  const value = Number(guessInput.value);

  if (!value || value < 1 || value > 100) {
    guessStatus.textContent = 'Digite um número válido entre 1 e 100.';
    return;
  }

  guessState.attempts += 1;
  attemptsEl.textContent = String(guessState.attempts);

  if (value < guessState.secretNumber) {
    guessStatus.textContent = 'É maior! Tente um número mais alto.';
  } else if (value > guessState.secretNumber) {
    guessStatus.textContent = 'É menor! Tente um número mais baixo.';
  } else {
    guessStatus.textContent = `Parabéns! Você acertou em ${guessState.attempts} tentativa(s).`;
    guessState.best = guessState.best === null ? guessState.attempts : Math.min(guessState.best, guessState.attempts);
    updateBest();
    guessInput.disabled = true;
    guessBtn.disabled = true;
    return;
  }

  guessInput.value = '';
  guessInput.focus();
}

guessBtn.addEventListener('click', checkGuess);

guessInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    checkGuess();
  }
});

restartAdivinha.addEventListener('click', () => {
  guessInput.disabled = false;
  guessBtn.disabled = false;
  newRound();
});

updateBest();
newRound();

const canvas = document.getElementById('pong-canvas');
const ctx = canvas.getContext('2d');
const pongScoreEl = document.getElementById('pong-score');
const startPongBtn = document.getElementById('pong-start');
const resetPongBtn = document.getElementById('pong-reset');

const pongState = {
  running: false,
  scoreLeft: 0,
  scoreRight: 0,
  paddleWidth: 14,
  paddleHeight: 100,
  paddleLeftY: (canvas.height - 100) / 2,
  paddleRightY: (canvas.height - 100) / 2,
  paddleSpeed: 7,
  ball: {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speedX: 5,
    speedY: 4,
  },
};

function resetPongBall() {
  pongState.ball.x = canvas.width / 2;
  pongState.ball.y = canvas.height / 2;
  pongState.ball.speedX = Math.random() > 0.5 ? 5 : -5;
  pongState.ball.speedY = (Math.random() * 3 + 2) * (Math.random() > 0.5 ? 1 : -1);
}

function resetPongGame() {
  pongState.scoreLeft = 0;
  pongState.scoreRight = 0;
  pongState.paddleLeftY = (canvas.height - pongState.paddleHeight) / 2;
  pongState.paddleRightY = (canvas.height - pongState.paddleHeight) / 2;
  pongScoreEl.textContent = `${pongState.scoreLeft} x ${pongState.scoreRight}`;
  resetPongBall();
}

function updatePong() {
  const { ball, paddleHeight, paddleWidth, paddleSpeed } = pongState;

  const keyState = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false,
  };

  window.addEventListener('keydown', (event) => {
    if (event.key === 'w' || event.key === 'W') keyState.w = true;
    if (event.key === 's' || event.key === 'S') keyState.s = true;
    if (event.key === 'ArrowUp') keyState.ArrowUp = true;
    if (event.key === 'ArrowDown') keyState.ArrowDown = true;
  });

  window.addEventListener('keyup', (event) => {
    if (event.key === 'w' || event.key === 'W') keyState.w = false;
    if (event.key === 's' || event.key === 'S') keyState.s = false;
    if (event.key === 'ArrowUp') keyState.ArrowUp = false;
    if (event.key === 'ArrowDown') keyState.ArrowDown = false;
  });

  if (keyState.w) pongState.paddleLeftY -= paddleSpeed;
  if (keyState.s) pongState.paddleLeftY += paddleSpeed;
  if (keyState.ArrowUp) pongState.paddleRightY -= paddleSpeed;
  if (keyState.ArrowDown) pongState.paddleRightY += paddleSpeed;

  pongState.paddleLeftY = Math.max(0, Math.min(canvas.height - paddleHeight, pongState.paddleLeftY));
  pongState.paddleRightY = Math.max(0, Math.min(canvas.height - paddleHeight, pongState.paddleRightY));

  ball.x += ball.speedX;
  ball.y += ball.speedY;

  if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
    ball.speedY *= -1;
  }

  const leftPaddleX = 20;
  const rightPaddleX = canvas.width - 20 - paddleWidth;

  const hitLeft =
    ball.x - ball.radius <= leftPaddleX + paddleWidth &&
    ball.x - ball.radius >= leftPaddleX &&
    ball.y >= pongState.paddleLeftY &&
    ball.y <= pongState.paddleLeftY + paddleHeight;

  const hitRight =
    ball.x + ball.radius >= rightPaddleX &&
    ball.x + ball.radius <= rightPaddleX + paddleWidth &&
    ball.y >= pongState.paddleRightY &&
    ball.y <= pongState.paddleRightY + paddleHeight;

  if (hitLeft || hitRight) {
    ball.speedX *= -1.08;
    ball.speedY += (ball.y - (pongState.paddleLeftY + paddleHeight / 2)) * 0.08;
  }

  if (ball.x < 0) {
    pongState.scoreRight += 1;
    pongScoreEl.textContent = `${pongState.scoreLeft} x ${pongState.scoreRight}`;
    resetPongBall();
  }

  if (ball.x > canvas.width) {
    pongState.scoreLeft += 1;
    pongScoreEl.textContent = `${pongState.scoreLeft} x ${pongState.scoreRight}`;
    resetPongBall();
  }
}

function drawPong() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0b1120';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#e5e7eb';
  ctx.setLineDash([10, 14]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(20, pongState.paddleLeftY, pongState.paddleWidth, pongState.paddleHeight);
  ctx.fillRect(canvas.width - 20 - pongState.paddleWidth, pongState.paddleRightY, pongState.paddleWidth, pongState.paddleHeight);

  ctx.beginPath();
  ctx.arc(pongState.ball.x, pongState.ball.y, pongState.ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#fbbf24';
  ctx.fill();

  ctx.fillStyle = '#e5e7eb';
  ctx.font = 'bold 26px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`${pongState.scoreLeft} : ${pongState.scoreRight}`, canvas.width / 2, 42);
}

function pongLoop() {
  if (pongState.running) {
    updatePong();
  }
  drawPong();
  requestAnimationFrame(pongLoop);
}

startPongBtn.addEventListener('click', () => {
  pongState.running = !pongState.running;
  startPongBtn.textContent = pongState.running ? 'Pausar' : 'Iniciar';
});

resetPongBtn.addEventListener('click', () => {
  pongState.running = false;
  startPongBtn.textContent = 'Iniciar';
  resetPongGame();
});

resetPongGame();
requestAnimationFrame(pongLoop);
