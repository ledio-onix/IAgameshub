const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const scoreLeftEl = document.getElementById('score-left');
const scoreRightEl = document.getElementById('score-right');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

const game = {
  running: false,
  speed: 7,
  paddleWidth: 14,
  paddleHeight: 100,
  leftY: (canvas.height - 100) / 2,
  rightY: (canvas.height - 100) / 2,
  leftScore: 0,
  rightScore: 0,
  ball: {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speedX: 5,
    speedY: 4,
  },
};

const keys = {
  w: false,
  s: false,
  ArrowUp: false,
  ArrowDown: false,
};

function updateScoreboard() {
  scoreLeftEl.textContent = String(game.leftScore);
  scoreRightEl.textContent = String(game.rightScore);
}

function resetBall() {
  game.ball.x = canvas.width / 2;
  game.ball.y = canvas.height / 2;

  const direction = Math.random() < 0.5 ? -1 : 1;
  const angle = (Math.random() - 0.5) * 2.6;

  game.ball.speedX = direction * (5 + Math.random() * 1.2);
  game.ball.speedY = angle * 4;
}

function resetGame() {
  game.running = false;
  startBtn.textContent = 'Iniciar';
  game.leftScore = 0;
  game.rightScore = 0;
  game.leftY = (canvas.height - game.paddleHeight) / 2;
  game.rightY = (canvas.height - game.paddleHeight) / 2;
  updateScoreboard();
  resetBall();
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function handlePaddleCollision() {
  const leftX = 20;
  const rightX = canvas.width - 20 - game.paddleWidth;
  const ball = game.ball;

  const hitLeft =
    ball.x - ball.radius <= leftX + game.paddleWidth &&
    ball.x - ball.radius >= leftX &&
    ball.y >= game.leftY &&
    ball.y <= game.leftY + game.paddleHeight;

  const hitRight =
    ball.x + ball.radius >= rightX &&
    ball.x + ball.radius <= rightX + game.paddleWidth &&
    ball.y >= game.rightY &&
    ball.y <= game.rightY + game.paddleHeight;

  if (hitLeft || hitRight) {
    const paddleY = hitLeft ? game.leftY : game.rightY;
    const relativeIntersect = (ball.y - (paddleY + game.paddleHeight / 2)) / (game.paddleHeight / 2);
    ball.speedX *= -1.08;
    ball.speedY = relativeIntersect * 7;
  }
}

function updateGame() {
  if (keys.w) game.leftY -= game.speed;
  if (keys.s) game.leftY += game.speed;
  if (keys.ArrowUp) game.rightY -= game.speed;
  if (keys.ArrowDown) game.rightY += game.speed;

  game.leftY = clamp(game.leftY, 0, canvas.height - game.paddleHeight);
  game.rightY = clamp(game.rightY, 0, canvas.height - game.paddleHeight);

  if (!game.running) {
    return;
  }

  const ball = game.ball;
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
    ball.speedY *= -1;
  }

  handlePaddleCollision();

  if (ball.x - ball.radius <= 0) {
    game.rightScore += 1;
    updateScoreboard();
    resetBall();
  }

  if (ball.x + ball.radius >= canvas.width) {
    game.leftScore += 1;
    updateScoreboard();
    resetBall();
  }
}

function drawNet() {
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.7)';
  ctx.lineWidth = 3;
  ctx.setLineDash([12, 14]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawPaddles() {
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(20, game.leftY, game.paddleWidth, game.paddleHeight);

  ctx.fillStyle = '#facc15';
  ctx.fillRect(canvas.width - 20 - game.paddleWidth, game.rightY, game.paddleWidth, game.paddleHeight);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(game.ball.x, game.ball.y, game.ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#f8fafc';
  ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#020817';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawNet();
  drawPaddles();
  drawBall();
}

function gameLoop() {
  updateGame();
  draw();
  requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (event) => {
  if (event.key in keys) {
    event.preventDefault();
    keys[event.key] = true;
  }
});

window.addEventListener('keyup', (event) => {
  if (event.key in keys) {
    keys[event.key] = false;
  }
});

startBtn.addEventListener('click', () => {
  game.running = !game.running;
  startBtn.textContent = game.running ? 'Pausar' : 'Iniciar';
});

resetBtn.addEventListener('click', () => {
  resetGame();
});

resetGame();
requestAnimationFrame(gameLoop);
