import { words } from './words.js';

function getRandomWord(words) {
    const rng = new Math.seedrandom();
    return words[Math.floor(rng() * words.length)].toUpperCase();
}

let currentWord;
let guessesRemaining;
let currentGuess = '';
let guessHistory = [];
let gameOver = false;

const colors = ['', 'orange', 'red', 'green'];
const colorHierarchy = { 'green': 3, 'orange': 2, 'red': 1, '': 0 };

function initializeGame() {
    currentWord = getRandomWord(words);
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

    console.log("New word:", currentWord); // For debugging
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

    function submitGuess() {
        const row = guessGrid.children[8 - guessesRemaining];
        const letterCells = row.querySelectorAll('.letter');
        const scoreCell = row.querySelector('.score');
    
        const correctLetterCount = getCorrectLetterCount(currentGuess, currentWord);
        scoreCell.textContent = correctLetterCount;
    
        for (let i = 0; i < 4; i++) {
            const cell = letterCells[i];
            cell.textContent = currentGuess[i];
            cell.classList.add('guessed');
    
            let cellColor;
            if (correctLetterCount === 0) {
                // If score is 0, turn all tiles red
                cellColor = 'red';
            } else if (currentGuess !== currentWord) {
                // Check if this letter was part of a previous zero-score guess
                const wasInZeroScoreGuess = guessHistory.some(guess => 
                    guess.includes(currentGuess[i]) && 
                    getCorrectLetterCount(guess, currentWord) === 0
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
    
        if (currentGuess === currentWord) {
            gameOver = true;
            row.classList.add('correct');
            setTimeout(() => {
                if (confirm(`Congratulations! You guessed the word in ${9 - guessesRemaining} tries! Play again?`)) {
                    initializeGame();
                }
            }, 300);
        } else if (guessesRemaining === 0) {
            gameOver = true;
            setTimeout(() => {
                if (confirm(`Game over! The word was ${currentWord}. Play again?`)) {
                    initializeGame();
                }
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