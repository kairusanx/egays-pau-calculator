document.addEventListener('DOMContentLoaded', () => {
  const WINNING_SCORE = 61;
  let player1Score = 0;
  let player2Score = 0;
  let currentPlayer = 1;
  let player1Balls = [];
  let player2Balls = [];
  let player1name = "Player 1";
  let player2name = "Player 2";

  const player1ScoreDisplay = document.getElementById('player1-score');
  const player2ScoreDisplay = document.getElementById('player2-score');
  const player1Box = document.getElementById('player1-box');
  const player2Box = document.getElementById('player2-box');
  const player1BallsList = document.getElementById('player1-balls-list');
  const player2BallsList = document.getElementById('player2-balls-list');
  const player1NeededScore = document.getElementById('player1-needed-score');
  const player2NeededScore = document.getElementById('player2-needed-score');
  const player1NameDisplay = document.getElementById('player1-name');
  const player2NameDisplay = document.getElementById('player2-name');
  player1NameDisplay.textContent = player1name;
  player2NameDisplay.textContent = player2name;

  const ballButtons = document.querySelectorAll('.ball-button');
  const changeTurnButton = document.getElementById('change-turn-button');
  const resetButton = document.getElementById('reset-button');

  function renderPocketedBalls(player, ballsArray) {
    const listElement = player === 1 ? player1BallsList : player2BallsList;
    listElement.innerHTML = '';
    ballsArray.sort((a, b) => a - b).forEach(ball => {
      const ballSpan = document.createElement('span');
      ballSpan.className = 'ball-list-item';
      ballSpan.textContent = ball;
      listElement.appendChild(ballSpan);
    });
  }

  function updateDisplays() {
    player1ScoreDisplay.textContent = player1Score;
    player2ScoreDisplay.textContent = player2Score;
    renderPocketedBalls(1, player1Balls);
    renderPocketedBalls(2, player2Balls);

    const player1PointsNeeded = WINNING_SCORE - player1Score;
    const player2PointsNeeded = WINNING_SCORE - player2Score;

    if (player1PointsNeeded <= 0) {
      player1NeededScore.textContent = 'Winner!';
      player1NeededScore.classList.add('font-bold', 'text-green-400');
    } else {
      player1NeededScore.textContent = `Points to 61: ${player1PointsNeeded}`;
      player1NeededScore.classList.remove('font-bold', 'text-green-400');
    }

    if (player2PointsNeeded <= 0) {
      player2NeededScore.textContent = 'Winner!';
      player2NeededScore.classList.add('font-bold', 'text-green-400');
    } else {
      player2NeededScore.textContent = `Points to 61: ${player2PointsNeeded}`;
      player2NeededScore.classList.remove('font-bold', 'text-green-400');
    }
  }

  function updatePlayerTurnDisplay() {
    if (currentPlayer === 1) {
      player1Box.classList.add('active-player');
      player2Box.classList.remove('active-player');
    } else {
      player2Box.classList.add('active-player');
      player1Box.classList.remove('active-player');
    }
  }

  ballButtons.forEach(button => {
    button.addEventListener('click', () => {
      const ballValue = parseInt(button.getAttribute('data-value'));
      let currentBallsArray = currentPlayer === 1 ? player1Balls : player2Balls;
      let opponentBallsArray = currentPlayer === 1 ? player2Balls : player1Balls;
      let currentScore = currentPlayer === 1 ? player1Score : player2Score;

      // Prevent the current player from pocketing a ball already pocketed by the opponent
      if (opponentBallsArray.includes(ballValue)) {
        alert(`Ball ${ballValue} is already pocketed by the other player!`);
        return;
      }

      if (button.classList.contains('scored')) {
        currentScore -= ballValue;
        const index = currentBallsArray.indexOf(ballValue);
        if (index > -1) currentBallsArray.splice(index, 1);
        button.classList.remove('scored');
      } else {
        currentScore += ballValue;
        currentBallsArray.push(ballValue);
        button.classList.add('scored');
      }

      if (currentPlayer === 1) {
        player1Score = currentScore;
        player1Balls = currentBallsArray;
      } else {
        player2Score = currentScore;
        player2Balls = currentBallsArray;
      }

      updateDisplays();
    });
  });

  changeTurnButton.addEventListener('click', () => {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updatePlayerTurnDisplay();
  });

  resetButton.addEventListener('click', () => {
    player1Score = 0;
    player2Score = 0;
    currentPlayer = 1;
    player1Balls = [];
    player2Balls = [];
    updateDisplays();
    updatePlayerTurnDisplay();
    ballButtons.forEach(button => {
      button.classList.remove('scored');
    });
  });

  updateDisplays();
  updatePlayerTurnDisplay();
});
