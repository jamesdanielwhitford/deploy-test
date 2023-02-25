// Define the possible words to be guessed
const words = [
  'that',
  'what',
  'have',
  'your',
  'know',
  'with',
  'just',
  'here',
  'they',
  'like',
  'come',
  'well',
  'yeah',
  'will',
  'want',
  'good',
  'from',
  'when',
  'time',
  'okay',
  'back',
  'look',
  'them',
  'were',
  'take',
  'then',
  'been',
  'tell',
  'some',
  'didn',
  'need',
  'more',
  'down',
  'make',
  'very',
  'only',
  'over',
  'love',
  'mean',
  'said',
  'give',
  'even',
  'much',
  'sure',
  'help',
  'into',
  'find',
  'life',
  'work',
  'must',
  'wait',
  'stop',
  'call',
  'talk',
  'away',
  'than',
  'home',
  'last',
  'told',
  'keep',
  'long',
  'name',
  'ever',
  'feel',
  'made',
  'done',
  'nice',
  'girl',
  'fine',
  'kind',
  'stay',
  'left',
  'came',
  'hear',
  'same',
  'show',
  'else',
  'kill',
  'next',
  'care',
  'went',
  'dead',
  'many',
  'mind',
  'wasn',
  'best',
  'hell',
  'real',
  'baby',
  'room',
  'move',
  'most',
  'seen',
  'live',
  'both',
  'once',
  'head',
  'used',
  'idea',
  'knew',
  'hold',
  'door',
  'such',
  'also',
  'took',
  'wife',
  'meet',
  'hard',
  'gone',
  'play',
  'open',
  'hope',
  'face',
  'lost',
  'turn',
  'case',
  'true',
  'soon',
  'each',
  'year',
  'hand',
  'part',
  'late',
  'gave',
  'damn',
  'five',
  'shut',
  'aren',
  'easy',
  'deal',
  'mine',
  'body',
  'dear',
  'four',
  'word',
  'hurt',
  'wish',
  'week',
  'rest',
  'fire',
  'game',
  'side',
  'read',
  'able',
  'lady',
  'shot',
  'city',
  'walk',
  'town',
  'high',
  'half',
  'died',
  'cool',
  'free',
  'whoa',
  'team',
  'line',
  'send',
  'full',
  'save',
  'hate',
  'food',
  'fact',
  'lord',
  'pick',
  'lose',
  'king',
  'plan',
  'sort',
  'safe',
  'book',
  'sent',
  'hour',
  'john',
  'sick',
  'poor',
  'past',
  'glad',
  'hair',
  'jack',
  'luck',
  'fast',
  'cold',
  'seem',
  'hang',
  'till',
  'felt',
  'sign',
  'pull',
  'beat',
  'date',
  'fall',
  'song',
  'road',
  'calm',
  'drop',
  'step',
  'land',
  'feet',
  'dude',
  'none',
  'pain',
  'kept',
  'wake',
  'busy',
  'ship',
  'sell',
  'dark',
  'ride',
  'born',
  'film',
  'wear',
  'hasn',
  'sing',
  'blue',
  'near',
  'rock',
  'paid',
  'ring',
  'bill',
  'york',
  'army',
  'lead',
  'fair',
  'fool',
  'club',
  'test',
  'join',
  'fear',
  'mike',
  'area',
  'ball',
  'boat',
  'gold',
  'fish',
  'mark',
  'fell',
  'deep',
  'star',
  'hide',
];

function getDailyWord(words) {
  const seed = Math.floor(Date.now() / (24 * 60 * 60 * 1000)); // Use the day of the year as a seed
  const rng = new Math.seedrandom(seed); // Create a random number generator with the seed
  return words[Math.floor(rng() * words.length)]; // Use the random number to select a word from the list
}
// Choose a random word from the list
let dailyWord = getDailyWord(words);

// Keep track of the number of guesses
let guessesRemaining = 8;

// Keep track of the user's guesses
let userGuesses = [];

// Set up the initial display
document.getElementById('word').textContent = dailyWord.replace(/./g, '*');

// Handle a user guess
function guess() {
  // Get the user's guess
  let guess = document.getElementById('guessInput').value.toLowerCase();

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

  // Add the guess to the user's list of guesses
  userGuesses.push(guess);

  // Update the list of guesses on the screen
  let guessList = '';
  for (let i = 0; i < userGuesses.length; i++) {
    let guessText = userGuesses[i];
    let guessScore = scoreGuess(guessText);
    guessList += guessText + ' (' + guessScore + ')\n';
  }
  document.getElementById('guesses').textContent = guessList;

  // Check if the guess is correct
  if (guess === dailyWord) {
    document.getElementById('message').textContent = 'You win!';
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
