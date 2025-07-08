
const grid = document.getElementById("grid");
const timerElement = document.getElementById("timer");
const doneWrapper = document.getElementById("doneWrapper");
const startButton = document.getElementById("startButton");
const difficultyLabel = document.getElementById("difficultyLabel");
const popupOverlay = document.getElementById("popupOverlay");
const popupMessage = document.getElementById("popupMessage");
const difficultySection = document.getElementById("difficultySection");
const subrangeLabel = document.getElementById("subrangeLabel");
const guessSection = document.getElementById("guessSection");
const guessInput = document.getElementById("guessInput");

let primeCount = 0;
let foundCount = 0;
let timerInterval;
let timeLeft = 25;
let currentDifficulty = "easy";
let hiddenPrime = null;

// Check if a number is prime
function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

// Get difficulty range
function getRange() {
  if (currentDifficulty === "easy") return { min: 300, max: 500 };
  if (currentDifficulty === "normal") return { min: 500, max: 1000 };
  return { min: 1000, max: 3000 };
}

// Generate valid subrange and odd numbers
function getValidSubrange(min, max) {
  let subMin, subMax, oddNumbers;

  do {
    const subrangeSize = Math.floor(Math.random() * (65 - 40 + 1)) + 40;
    subMin = Math.floor(Math.random() * (max - min - subrangeSize + 1)) + min;
    subMax = subMin + subrangeSize;

    oddNumbers = [];
    for (let i = subMin; i <= subMax; i++) {
      if (i % 2 !== 0) oddNumbers.push(i);
    }
  } while (oddNumbers.length < 25);

  return { subMin, subMax, oddNumbers };
}

function startGame() {
  const selected = document.querySelector('input[name="difficulty"]:checked');
  currentDifficulty = selected ? selected.value : "easy";

  difficultySection.style.display = "none";
  startButton.style.display = "none";
  grid.style.display = "grid";
  timerElement.style.display = "block";
  doneWrapper.style.display = "block";
  difficultyLabel.textContent = `Difficulty: ${currentDifficulty.toUpperCase()}`;
  difficultyLabel.style.display = "block";

  generateGrid();
}

function generateGrid() {
  grid.innerHTML = "";
  primeCount = 0;
  foundCount = 0;
  guessSection.style.display = "none";
  startTimer();

  const { min, max } = getRange();
  const { subMin, subMax, oddNumbers } = getValidSubrange(min, max);

  const primesInSubrange = oddNumbers.filter(isPrime);
  if (primesInSubrange.length < 2) return generateGrid();

  hiddenPrime = primesInSubrange[Math.floor(Math.random() * primesInSubrange.length)];
  const visiblePrimes = primesInSubrange.filter(p => p !== hiddenPrime);
  primeCount = visiblePrimes.length + 1;

  subrangeLabel.textContent = `🔍 Subrange: ${subMin} – ${subMax} (Dev Hint: Hidden Prime = ${hiddenPrime})`;
  subrangeLabel.style.display = "block";

  const gridNumbers = [...visiblePrimes];
  while (gridNumbers.length < 24) {
    const randOdd = oddNumbers[Math.floor(Math.random() * oddNumbers.length)];
    if (!gridNumbers.includes(randOdd) && randOdd !== hiddenPrime) {
      gridNumbers.push(randOdd);
    }
  }

  gridNumbers.sort(() => 0.5 - Math.random());

  for (let i = 0; i < 25; i++) {
    const square = document.createElement("div");
    square.classList.add("square");

    if (i === 12) {
      square.textContent = "?";
      square.dataset.isHidden = "true";
      square.style.backgroundColor = "#ffeaa7";
    } else {
      const number = gridNumbers.pop();
      square.textContent = number;
      const isPrimeFlag = isPrime(number);
      square.dataset.isPrime = isPrimeFlag;
      square.dataset.clicked = "false";

      square.addEventListener("click", function () {
        if (square.dataset.clicked === "true") return;

        if (square.dataset.isPrime === "true") {
          square.style.backgroundColor = "#00b894";
          square.classList.add("disabled");
          square.style.pointerEvents = "none";
          square.dataset.clicked = "true";
          foundCount++;
        } else {
          square.style.backgroundColor = "#d63031";
          showPopup("❌ Wrong guess! Game will restart.", true);
        }
      });
    }

    grid.appendChild(square);
  }

  guessSection.style.display = "block";
}

function submitGuess() {
  const guess = parseInt(guessInput.value);
  if (guess === hiddenPrime) {
    const middleBlock = grid.children[12];
    middleBlock.textContent = hiddenPrime;
    middleBlock.style.backgroundColor = "#00b894";
    foundCount++;
    checkResult();
  } else {
    showPopup("❌ Incorrect hidden prime guess!", true);
  }
}

function startTimer() {
  timeLeft = 25;
  timerElement.textContent = `⏱ Time Left: ${timeLeft}s`;
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `⏱ Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showPopup("⏰ Time's up! Game will restart.", true);
    }
  }, 1000);
}

function showPopup(message, restart = false) {
  popupMessage.textContent = message;
  popupOverlay.style.display = "flex";
  popupOverlay.dataset.restart = restart;
  clearInterval(timerInterval);
}

function restartGame() {
  popupOverlay.style.display = "none";
  startGame();
}

function goHome() {
  popupOverlay.style.display = "none";
  grid.style.display = "none";
  timerElement.style.display = "none";
  doneWrapper.style.display = "none";
  startButton.style.display = "inline-block";
  difficultyLabel.style.display = "none";
  difficultySection.style.display = "block";
  subrangeLabel.style.display = "none";
  guessSection.style.display = "none";
}

function checkResult() {
  if (foundCount === primeCount) {
    showPopup("🏆 You found all the primes including the hidden one! You won!", true);
  } else {
    showPopup(`🚫 You missed some! Found ${foundCount} of ${primeCount}.`, true);
  }
}
