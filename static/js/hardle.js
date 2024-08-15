import { words } from './words.js';

function getDailyWord(words) {
  const seed = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
  const rng = new Math.seedrandom(seed);
  return words[Math.floor(rng() * words.length)].toUpperCase();
}

let dailyWord = getDailyWord(words);
let guessesRemaining = 8;
let currentGuess = '';
let guessHistory = [];
let gameOver = false;

const colors = ['', 'orange', 'red', 'green'];
const colorHierarchy = { 'green': 3, 'orange': 2, 'red': 1, '': 0 };

function initializeGame() {
    dailyWord = getDailyWord(words);
    guessesRemaining = 8;
    currentGuess = '';
    guessHistory = [];
    gameOver = false;

    // Clear the grid
    const guessGrid = document.getElementById('guessGrid');
    guessGrid.querySelectorAll('.guess-row').forEach(row => {
        row.querySelectorAll('.letter').forEach(cell => {
            cell.textContent = '';
            cell.className = 'letter';
            cell.dataset.color = ''; // Reset the color data attribute
        });
        row.querySelector('.score').textContent = '';
        row.classList.remove('correct'); // Remove the 'correct' class from rows
    });

    // Reset keyboard colors
    document.querySelectorAll('.keyboard button').forEach(button => {
        button.className = button.classList.contains('wide-button') ? 'wide-button' : '';
    });

    console.log("Today's word (for debugging):", dailyWord);
}

document.addEventListener('DOMContentLoaded', () => {
    initializeGame();

    const keyboard = document.querySelector('.keyboard');
    const guessGrid = document.getElementById('guessGrid');
    const rulesButton = document.getElementById('rulesButton');
    const rulesModal = document.getElementById('rulesModal');
    const closeButton = document.querySelector('.close');

    keyboard.addEventListener('click', handleKeyboardClick);
    document.addEventListener('keydown', handleKeyPress);
    guessGrid.addEventListener('click', handleGridClick);
    rulesButton.addEventListener('click', openRulesModal);
    closeButton.addEventListener('click', closeRulesModal);
    window.addEventListener('click', closeModalOnOutsideClick);

    function handleKeyboardClick(e) {
        if (e.target.matches('button')) {
            const key = e.target.dataset.key;
            handleInput(key);
        }
    }

    function handleKeyPress(e) {
        if (e.key.match(/^[a-z]$/i)) {
            handleInput(e.key.toUpperCase());
        } else if (e.key === 'Enter') {
            handleInput('ENTER');
        } else if (e.key === 'Backspace') {
            handleInput('BACKSPACE');
        }
    }

    function handleGridClick(e) {
        if (e.target.matches('.guess-row > div.letter') && e.target.textContent) {
            toggleColor(e.target);
        }
    }

    function handleInput(key) {
        if (gameOver) return;

        if (key === 'ENTER') {
            if (currentGuess.length === 4) {
                submitGuess();
            } else {
                alert('Please enter a 4-letter word.');
            }
        } else if (key === 'BACKSPACE') {
            currentGuess = currentGuess.slice(0, -1);
        } else if (currentGuess.length < 4) {
            currentGuess += key;
        }
        updateGrid();
    }

    function showGameEndModal(message, attempts) {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.left = '0';
        modal.style.top = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
    
        const content = document.createElement('div');
        content.style.backgroundColor = 'white';
        content.style.padding = '20px';
        content.style.borderRadius = '5px';
        content.style.textAlign = 'center';
        content.style.maxWidth = '90%';
        content.style.width = '400px';
    
        const text = document.createElement('p');
        text.textContent = message;
        text.style.fontSize = '18px';
        text.style.marginBottom = '20px';
        content.appendChild(text);
    
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.style.gap = '10px';
    
        const createButton = (text, onClick, className) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.onclick = onClick;
            button.className = className;
            button.style.width = '100%';
            button.style.maxWidth = '250px';
            return button;
        };
    
        const closeModal = () => document.body.removeChild(modal);
    
        const playRandleButton = createButton('Play Randle', () => {
            closeModal();
            window.location.href = '/randle';
        }, 'nav-button');
    
        const coffeeButton = createButton('☕️ Buy Me a Coffee', () => {
            window.open('https://www.buymeacoffee.com/jameswhitford', '_blank');
        }, 'nav-button');
    
        const shareButton = createButton('Share Score', () => {
            const shareText = `I solved today's Hardle in ${attempts} attempts! Can you beat that? #Hardle`;
            if (navigator.share) {
                navigator.share({
                    title: 'My Hardle Score',
                    text: shareText,
                    url: window.location.href,
                }).catch(console.error);
            } else {
                // Fallback for browsers that don't support Web Share API
                const tempInput = document.createElement('input');
                document.body.appendChild(tempInput);
                tempInput.value = shareText;
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                alert('Score copied to clipboard!');
            }
        }, 'nav-button');
    
        const closeButton = createButton('Close', closeModal, 'nav-button');
    
        buttonContainer.appendChild(playRandleButton);
        buttonContainer.appendChild(coffeeButton);
        buttonContainer.appendChild(shareButton);
        buttonContainer.appendChild(closeButton);
    
        content.appendChild(buttonContainer);
        modal.appendChild(content);
        document.body.appendChild(modal);
    }

    function submitGuess() {
        const row = guessGrid.children[8 - guessesRemaining];
        const letterCells = row.querySelectorAll('.letter');
        const scoreCell = row.querySelector('.score');
    
        const correctLetterCount = getCorrectLetterCount(currentGuess, dailyWord);
        scoreCell.textContent = correctLetterCount;
    
        for (let i = 0; i < 4; i++) {
            const cell = letterCells[i];
            cell.textContent = currentGuess[i];
            cell.classList.add('guessed');
    
            let cellColor;
            if (correctLetterCount === 0) {
                // If score is 0, turn all tiles red
                cellColor = 'red';
            } else if (currentGuess !== dailyWord) {
                // Check if this letter was part of a previous zero-score guess
                const wasInZeroScoreGuess = guessHistory.some(guess => 
                    guess.includes(currentGuess[i]) && 
                    getCorrectLetterCount(guess, dailyWord) === 0
                );
                
                if (wasInZeroScoreGuess) {
                    cellColor = 'red';
                } else {
                    cellColor = 'orange';
                }
            } else {
                // Perfect match
                cellColor = 'green';
            }
    
            cell.className = `letter guessed ${cellColor}`;
            cell.dataset.color = cellColor;
            updateKeyboardColor(currentGuess[i], cellColor);
        }
    
        guessHistory.push(currentGuess);
        guessesRemaining--;
    
        if (currentGuess === dailyWord) {
            gameOver = true;
            row.classList.add('correct');
            setTimeout(() => {
                showGameEndModal(`Congratulations! You guessed the word in ${8 - guessesRemaining} tries!`, 8 - guessesRemaining);
            }, 300);
        } else if (guessesRemaining === 0) {
            gameOver = true;
            setTimeout(() => {
                showGameEndModal(`Game over! The word was ${dailyWord}`, 8);
            }, 300);
        }
    
        currentGuess = '';
    }

    function updateGrid() {
        const row = guessGrid.children[8 - guessesRemaining];
        const letterCells = row.querySelectorAll('.letter');
        for (let i = 0; i < 4; i++) {
            const cell = letterCells[i];
            cell.textContent = currentGuess[i] || '';
        }
    }

    function toggleColor(cell) {
        if (!cell.classList.contains('guessed')) return;
        
        let currentColorIndex = colors.indexOf(cell.dataset.color || '');
        let nextColorIndex = (currentColorIndex + 1) % colors.length;
        
        cell.dataset.color = colors[nextColorIndex];
        cell.className = 'letter guessed ' + colors[nextColorIndex];

        updateKeyboardColorFromGrid(cell.textContent);
    }

    function updateKeyboardColor(letter, newColor) {
        const keyboardButton = document.querySelector(`.keyboard button[data-key="${letter}"]`);
        if (keyboardButton) {
            const currentColor = getKeyboardButtonColor(keyboardButton);
            if (colorHierarchy[newColor] > colorHierarchy[currentColor]) {
                setKeyboardButtonColor(keyboardButton, newColor);
            }
        }
    }

    function updateKeyboardColorFromGrid(letter) {
        const gridCells = document.querySelectorAll('#guessGrid .letter');
        let highestColor = '';

        gridCells.forEach(cell => {
            if (cell.textContent === letter) {
                const cellColor = cell.dataset.color || '';
                if (colorHierarchy[cellColor] > colorHierarchy[highestColor]) {
                    highestColor = cellColor;
                }
            }
        });

        const keyboardButton = document.querySelector(`.keyboard button[data-key="${letter}"]`);
        if (keyboardButton) {
            setKeyboardButtonColor(keyboardButton, highestColor);
        }
    }

    function getKeyboardButtonColor(button) {
        return button.className.split(' ').find(c => colorHierarchy.hasOwnProperty(c)) || '';
    }

    function setKeyboardButtonColor(button, color) {
        button.className = `letter-button ${color}`;
        if (button.classList.contains('wide-button')) {
            button.classList.add('wide-button');
        }
    }

    function getCorrectLetterCount(guess, answer) {
        const guessLetters = guess.split('');
        const answerLetters = answer.split('');
        let count = 0;

        for (let i = 0; i < guessLetters.length; i++) {
            const index = answerLetters.indexOf(guessLetters[i]);
            if (index !== -1) {
                count++;
                answerLetters[index] = null; // Mark this letter as counted
            }
        }

        return count;
    }

    function openRulesModal() {
        rulesModal.style.display = 'block';
    }

    function closeRulesModal() {
        rulesModal.style.display = 'none';
    }

    function closeModalOnOutsideClick(event) {
        if (event.target === rulesModal) {
            rulesModal.style.display = 'none';
        }
    }
});