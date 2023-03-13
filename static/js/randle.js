import { words } from './words.js';

function getDailyWord(words) {
  return words[Math.floor(Math.random() * words.length)];
}

// Choose a random word from the list
let dailyWord = getDailyWord(words);

// Keep track of the number of guesses
let guessesRemaining = 8;

// Keep track of the user's guesses
let userGuesses = [];

// Set up the initial display
document.getElementById('word').textContent = dailyWord.replace(/./g, '*');

const input = document.getElementById('guessInput');
input.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) {
    event.preventDefault(); // prevent the default action of submitting the form
    guess();
  }
});

const guessButton = document.getElementById('guessButton');
guessButton.addEventListener('click', (event) => {
  guess();
});

const alertRules = document.getElementById('rules');
alertRules.addEventListener('click', (event) => {
  alert(
    `1. Every day, a new four-letter word is chosen for you to guess.\n2. You have eight chances to guess the word correctly before you lose the game.\n3. After each guess, you'll receive a score that indicates how many letters in your guess are also in the daily word.\n4. If the daily word contains a double letter, like "ball", and you guess a word that contains the same double letter, like "bell", then the double letter will be counted as two separate matches.\n5. Your previous guesses and scores will be displayed so you can keep track of your progress.`
  );
});

// Handle a user guess
function guess() {
  // Get the user's guess
  let guess = document.getElementById('guessInput').value.toLowerCase();

  // strip the empty space from the end of the guess
  guess = guess.trim();

  // Clear the guess input field
  document.getElementById('guessInput').value = '';

  // If the user has already guessed this word, don't count it as a guess
  if (userGuesses.includes(guess)) {
    document.getElementById('message').textContent =
      'You already guessed that!';
    return;
  }

  if (guess.length !== dailyWord.length) {
    document.getElementById('message').textContent =
      'Your guess must be 4 letters!';
    return;
  }

  // check if guess is in swears

  // if (swears.includes(guess)) {
  //   document.getElementById('message').textContent = 'No swearing! 🐜';
  //   return;
  // }

  // Add the guess to the user's list of guesses
  userGuesses.push(guess);

  dailyGuessesAndScores = [];

  // Update the list of guesses on the screen
  let guessList = '';
  for (let i = 0; i < userGuesses.length; i++) {
    let guessText = userGuesses[i];
    let guessScore = scoreGuess(guessText);
    guessList += guessText + '(' + guessScore + ')\n';
    if (i == 3) {
      guessList += '<br/><br/>';
    }
    dailyGuessesAndScores.push({ guess: guessText, score: guessScore });
  }
  document.getElementById('guesses').innerHTML = guessList;

  updateSession('dailyGuesses', dailyGuessesAndScores);

  // Check if the guess is correct
  if (guess === dailyWord) {
    document.getElementById(
      'message'
    ).textContent = `You win! You guessed the word in ${
      9 - guessesRemaining
    } guesses!`;
    // change message color to green
    document.getElementById('message').style.color = 'green';
    document.getElementById('word').textContent = dailyWord;
    disableInput();
    return;
  }

  // Update the remaining guesses
  guessesRemaining--;
  document.getElementById('message').textContent =
    'Incorrect guess! ' + guessesRemaining + ' guesses remaining.';

  // If the user is out of guesses, reveal the word
  if (guessesRemaining === 0) {
    document.getElementById('word').textContent = dailyWord;
    disableInput();
  }
}

// Disable the input field and button
function disableInput() {
  document.getElementById('guessInput').disabled = true;
  document.querySelector('button').disabled = true;
}

// Score a guess by counting how many letters are in the daily word

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

function updateSession(key, value) {
  $.ajax({
    type: 'POST',
    url: '/update_session',
    contentType: 'application/json',
    data: JSON.stringify({ key: key, value: value }),
    success: function (response) {
      console.log(response);
    },
    error: function (response) {
      console.error(response);
    },
  });
}

// Get all the letter buttons
const letterButtons = document.querySelectorAll('.letter-button');

// Define the sequence of colors
const colors = ['red', 'orange', 'green', 'grey'];

// Add click event listeners to each button
letterButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    // Get the current color of the button
    const currentColor = button.classList[1];

    // Find the index of the current color in the colors array
    const currentColorIndex = colors.indexOf(currentColor);

    // Calculate the index of the next color in the colors array
    const nextColorIndex = (currentColorIndex + 1) % colors.length;

    // Get the next color from the colors array
    const nextColor = colors[nextColorIndex];

    // Remove the current color class from the button
    button.classList.remove(currentColor);

    // Add the next color class to the button
    button.classList.add(nextColor);
  });
});
