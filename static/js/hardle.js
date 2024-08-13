import { words } from './words.js';

function getDailyWord(words) {
  const seed = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
  const rng = new Math.seedrandom(seed);
  return words[Math.floor(rng() * words.length)];
}

let dailyWord = getDailyWord(words);
let guessesRemaining = 8;
let userGuesses = [];
let currentGuess = '';

document.getElementById('word').textContent = dailyWord.replace(/./g, '*');

// Remove event listeners for the input field and guess button
const input = document.getElementById('guessInput');
input.style.display = 'none'; // Hide the input field

const guessButton = document.getElementById('guessButton');
guessButton.style.display = 'none'; // Hide the guess button

const alertRules = document.getElementById('rules');
alertRules.addEventListener('click', (event) => {
  alert(
    `1. Every day, a new four-letter word is chosen for you to guess.\n2. You have eight chances to guess the word correctly before you lose the game.\n3. After each guess, you'll receive a score that indicates how many letters in your guess are also in the daily word.\n4. If the daily word contains a double letter, like "ball", and you guess a word that contains the same double letter, like "bell", then the double letter will be counted as two separate matches.\n5. Your previous guesses and scores will be displayed so you can keep track of your progress.`
  );
});

// Add event listeners to the on-screen keyboard
const letterButtons = document.querySelectorAll('.letter-button');
letterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const letter = button.textContent.toLowerCase();
    if (currentGuess.length < 4) {
      currentGuess += letter;
      updateCurrentGuessDisplay();
    }
  });
});

// Add event listener for the Enter key
const enterButton = document.querySelector('.letter-button[data-key="ENTER"]');
enterButton.addEventListener('click', () => {
  if (currentGuess.length === 4) {
    makeGuess(currentGuess);
    currentGuess = '';
    updateCurrentGuessDisplay();
  }
});

// Add event listener for the Backspace key
const backspaceButton = document.querySelector('.letter-button[data-key="⌫"]');
backspaceButton.addEventListener('click', () => {
  if (currentGuess.length > 0) {
    currentGuess = currentGuess.slice(0, -1);
    updateCurrentGuessDisplay();
  }
});

function updateCurrentGuessDisplay() {
  const currentGuessElement = document.getElementById('currentGuess');
  currentGuessElement.textContent = currentGuess.padEnd(4, '_');
}

function makeGuess(guess) {
  if (userGuesses.includes(guess)) {
    document.getElementById('message').textContent = 'You already guessed that!';
    return;
  }

  userGuesses.push(guess);
  updateGuessList();

  if (guess === dailyWord) {
    document.getElementById('message').textContent = `You win! You guessed the word in ${9 - guessesRemaining} guesses!`;
    document.getElementById('message').style.color = 'green';
    document.getElementById('word').textContent = dailyWord;
    disableKeyboard();
    return;
  }

  guessesRemaining--;
  document.getElementById('message').textContent = `Incorrect guess! ${guessesRemaining} guesses remaining.`;

  if (guessesRemaining === 0) {
    document.getElementById('word').textContent = dailyWord;
    disableKeyboard();
  }

  updateKeyboardColors(guess);
}

function updateGuessList() {
  let guessList = '';
  for (let i = 0; i < userGuesses.length; i++) {
    let guessText = userGuesses[i];
    let guessScore = scoreGuess(guessText);
    guessList += guessText + '(' + guessScore + ')\n';
    if (i == 3) {
      guessList += '<br/><br/>';
    }
  }
  document.getElementById('guesses').innerHTML = guessList;
}

function disableKeyboard() {
  letterButtons.forEach((button) => {
    button.disabled = true;
  });
}

function scoreGuess(guess) {
  let score = 0;
  let unmatchedLetters = dailyWord.split('');
  for (let i = 0; i < guess.length; i++) {
    let letterIndex = unmatchedLetters.indexOf(guess[i]);
    if (letterIndex >= 0) {
      score++;
      unmatchedLetters.splice(letterIndex, 1);
    }
  }
  return score;
}

function updateKeyboardColors(guess) {
  const dailyWordLetters = dailyWord.split('');
  
  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i];
    const button = document.querySelector(`.letter-button[data-key="${letter.toUpperCase()}"]`);
    
    if (dailyWord[i] === letter) {
      button.classList.add('correct');
    } else if (dailyWordLetters.includes(letter)) {
      button.classList.add('present');
    } else {
      button.classList.add('absent');
    }
  }
}

// Initialize the current guess display
updateCurrentGuessDisplay();