import { words } from './words.js';

function getDailyWord(words) {
  const seed = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
  const rng = new Math.seedrandom(seed);
  return words[Math.floor(rng() * words.length)].toUpperCase();
}

let dailyWord = getDailyWord(words);
let guessesRemaining = 6;
let currentGuess = '';
let guessHistory = [];
let gameOver = false;

const colors = ['', 'red', 'orange', 'green'];

document.addEventListener('DOMContentLoaded', () => {
  const keyboard = document.querySelector('.keyboard');
  const guessGrid = document.getElementById('guessGrid');

  keyboard.addEventListener('click', handleKeyboardClick);
  document.addEventListener('keydown', handleKeyPress);
  guessGrid.addEventListener('click', handleGridClick);

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
    if (e.target.matches('.guess-row > div') && e.target.textContent) {
      toggleColor(e.target);
    }
  }

  function handleInput(key) {
    if (gameOver) return;

    if (key === 'ENTER') {
      if (currentGuess.length === 4) {
        submitGuess();
      }
    } else if (key === 'BACKSPACE') {
      currentGuess = currentGuess.slice(0, -1);
    } else if (currentGuess.length < 4) {
      currentGuess += key;
    }
    updateGrid();
  }

  function submitGuess() {
    if (!words.includes(currentGuess.toLowerCase())) {
      alert('Not in word list');
      return;
    }

    const row = guessGrid.children[6 - guessesRemaining];

    for (let i = 0; i < 4; i++) {
      const cell = row.children[i];
      cell.textContent = currentGuess[i];
      cell.classList.add('guessed');
    }

    guessHistory.push(currentGuess);
    guessesRemaining--;

    if (currentGuess === dailyWord) {
      gameOver = true;
      row.classList.add('correct');
      setTimeout(() => {
        alert(`Congratulations! You guessed the word in ${6 - guessesRemaining} tries!`);
      }, 300);
    } else if (guessesRemaining === 0) {
      gameOver = true;
      setTimeout(() => {
        alert(`Game over! The word was ${dailyWord}`);
      }, 300);
    }

    currentGuess = '';
  }

  function updateGrid() {
    const row = guessGrid.children[6 - guessesRemaining];
    for (let i = 0; i < 4; i++) {
      const cell = row.children[i];
      cell.textContent = currentGuess[i] || '';
    }
  }

  function toggleColor(cell) {
    if (!cell.classList.contains('guessed')) return;
    
    let currentColorIndex = colors.indexOf(cell.dataset.color || '');
    let nextColorIndex = (currentColorIndex + 1) % colors.length;
    
    cell.dataset.color = colors[nextColorIndex];
    cell.className = 'guessed ' + colors[nextColorIndex];
  }

  console.log("Today's word (for debugging):", dailyWord);
});