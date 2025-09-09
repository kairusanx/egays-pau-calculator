document.addEventListener('DOMContentLoaded', () => {
            // State variables for the game
            let player1Score = 0;
            let player2Score = 0;
            let currentPlayer = 1;
            let player1Balls = [];
            let player2Balls = [];
            let player1Wins = 0;
            let player2Wins = 0;
            
            // Default and handicapped winning scores
            const DEFAULT_WINNING_SCORE = 61;
            let player1WinningScore = DEFAULT_WINNING_SCORE;
            let player2WinningScore = DEFAULT_WINNING_SCORE;

            // DOM element references
            const player1ScoreDisplay = document.getElementById('player1-score');
            const player2ScoreDisplay = document.getElementById('player2-score');
            const player1Box = document.getElementById('player1-box');
            const player2Box = document.getElementById('player2-box');
            const player1BallsList = document.getElementById('player1-balls-list');
            const player2BallsList = document.getElementById('player2-balls-list');
            const player1NeededScore = document.getElementById('player1-needed-score');
            const player2NeededScore = document.getElementById('player2-needed-score');
            const player1WinTally = document.getElementById('player1-win-tally');
            const player2WinTally = document.getElementById('player2-win-tally');
            const handicapRadios = document.querySelectorAll('input[name="handicap"]');

            const ballButtons = document.querySelectorAll('.ball-button');
            const changeTurnButton = document.getElementById('change-turn-button');
            const newGameButton = document.getElementById('new-game-button');
            const resetButton = document.getElementById('reset-button');

            // Function to render the list of pocketed balls for a given player
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

            // Function to update all displays based on the current game state
            function updateDisplays() {
                player1ScoreDisplay.textContent = player1Score;
                player2ScoreDisplay.textContent = player2Score;
                renderPocketedBalls(1, player1Balls);
                renderPocketedBalls(2, player2Balls);
                
                // Calculate and display points needed to win based on handicap
                const player1PointsNeeded = Math.max(0, player1WinningScore - player1Score);
                const player2PointsNeeded = Math.max(0, player2WinningScore - player2Score);
                
                let gameWon = false;

                if (player1PointsNeeded === 0 && player1Score >= player1WinningScore) {
                    player1NeededScore.textContent = `WINNER! (${player1WinningScore} pts)`;
                    player1NeededScore.classList.add('font-bold', 'text-green-600');
                    gameWon = true;
                } else {
                    player1NeededScore.textContent = `Points to ${player1WinningScore}: ${player1PointsNeeded}`;
                    player1NeededScore.classList.remove('font-bold', 'text-green-600');
                }

                if (player2PointsNeeded === 0 && player2Score >= player2WinningScore) {
                    player2NeededScore.textContent = `WINNER! (${player2WinningScore} pts)`;
                    player2NeededScore.classList.add('font-bold', 'text-green-600');
                    gameWon = true;
                } else {
                    player2NeededScore.textContent = `Points to ${player2WinningScore}: ${player2PointsNeeded}`;
                    player2NeededScore.classList.remove('font-bold', 'text-green-600');
                }
                
                // Check for a winner and update the win tally
                if (gameWon) {
                    if (player1Score >= player1WinningScore && player2Score >= player2WinningScore) {
                        // Tie scenario, for now we do nothing
                    } else if (player1Score >= player1WinningScore) {
                        player1Wins++;
                        disableBallButtons();
                    } else if (player2Score >= player2WinningScore) {
                        player2Wins++;
                        disableBallButtons();
                    }
                }

                // Update the win tally display
                player1WinTally.textContent = player1Wins;
                player2WinTally.textContent = player2Wins;
            }

            // Function to visually highlight the current player
            function updatePlayerTurnDisplay() {
                if (currentPlayer === 1) {
                    player1Box.classList.add('active-player');
                    player2Box.classList.remove('active-player');
                } else {
                    player2Box.classList.add('active-player');
                    player1Box.classList.remove('active-player');
                }
            }
            
            // Function to disable ball buttons once a game is won
            function disableBallButtons() {
                ballButtons.forEach(button => {
                    button.disabled = true;
                    button.style.cursor = 'not-allowed';
                });
            }

            // Function to enable ball buttons for a new game
            function enableBallButtons() {
                ballButtons.forEach(button => {
                    button.disabled = false;
                    button.style.cursor = 'pointer';
                });
            }

            // Function to reset the current game score and balls
            function resetCurrentGame() {
                player1Score = 0;
                player2Score = 0;
                currentPlayer = 1;
                player1Balls = [];
                player2Balls = [];
                ballButtons.forEach(button => {
                    button.classList.remove('scored');
                });
                enableBallButtons();
                updateDisplays();
                updatePlayerTurnDisplay();
            }

            // Add event listeners to each ball button for scoring
            ballButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Do nothing if the game has ended
                    if (player1Score >= player1WinningScore || player2Score >= player2WinningScore) {
                        return;
                    }

                    const ballValue = parseInt(button.getAttribute('data-value'));
                    const isAlreadyScored = button.classList.contains('scored');
                    const disabledBy = button.getAttribute('data-disabled-by');

                    if (currentPlayer === 1) {
                        if (isAlreadyScored && disabledBy === '1') {
                            // If Player 1 un-scores the ball, re-enable it for Player 1
                            player1Score -= ballValue;
                            player1Balls = player1Balls.filter(val => val !== ballValue);
                            button.classList.remove('scored');
                            button.disabled = false;
                            button.removeAttribute('data-disabled-by');
                        } else if (!isAlreadyScored || disabledBy === '1') {
                            // If Player 1 scores the ball, disable it for Player 2
                            player1Score += ballValue;
                            player1Balls.push(ballValue);
                            button.classList.add('scored');
                            button.disabled = false; // Keep it enabled for Player 1
                            button.setAttribute('data-disabled-by', '1'); // Mark the ball as disabled by Player 1
                        }
                    } else { // Current player is 2
                        if (isAlreadyScored && disabledBy === '2') {
                            // If Player 2 un-scores the ball, re-enable it for Player 2
                            player2Score -= ballValue;
                            player2Balls = player2Balls.filter(val => val !== ballValue);
                            button.classList.remove('scored');
                            button.disabled = false;
                            button.removeAttribute('data-disabled-by');
                        } else if (!isAlreadyScored || disabledBy === '2') {
                            // If Player 2 scores the ball, disable it for Player 1
                            player2Score += ballValue;
                            player2Balls.push(ballValue);
                            button.classList.add('scored');
                            button.disabled = false; // Keep it enabled for Player 2
                            button.setAttribute('data-disabled-by', '2'); // Mark the ball as disabled by Player 2
                        }
                    }

                    updateDisplays();
                });
            });

            // "Change Turn" button
            changeTurnButton.addEventListener('click', () => {
                currentPlayer = currentPlayer === 1 ? 2 : 1;

                // Re-enable balls that were disabled by the other player
                ballButtons.forEach(button => {
                    const disabledBy = button.getAttribute('data-disabled-by');
                    if (disabledBy && parseInt(disabledBy) !== currentPlayer) {
                        button.disabled = true; // Keep it disabled for the other player
                    } else {
                        button.disabled = false; // Re-enable for the current player
                    }
                });

                updatePlayerTurnDisplay();
            });
            
            // "Next Game" button - resets score but keeps win tally
            newGameButton.addEventListener('click', () => {
                resetCurrentGame();
            });

            // "Reset All" button - resets everything
            resetButton.addEventListener('click', () => {
                player1Wins = 0;
                player2Wins = 0;
                player1WinningScore = DEFAULT_WINNING_SCORE;
                player2WinningScore = DEFAULT_WINNING_SCORE;
                handicapRadios[0].checked = true; // Set handicap to none
                resetCurrentGame();
            });

            // Listen for handicap changes
            handicapRadios.forEach(radio => {
                radio.addEventListener('change', (event) => {
                    if (event.target.value === 'player2-50') {
                        player1WinningScore = 70;
                        player2WinningScore = 50;
                    } else if (event.target.value === 'player2-40') {
                        player1WinningScore = 80;
                        player2WinningScore = 40;
                    } else {
                        player1WinningScore = DEFAULT_WINNING_SCORE;
                        player2WinningScore = DEFAULT_WINNING_SCORE;
                    }
                    updateDisplays();
                });
            });

            // Initial setup on page load
            updateDisplays();
            updatePlayerTurnDisplay();
        });