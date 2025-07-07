const grid = document.getElementById("grid");
const timerElement = document.getElementById("timer");
const doneWrapper = document.getElementById("doneWrapper");
const startButton = document.getElementById("startButton");
const difficultyLabel = document.getElementById("difficultyLabel");
const popupOverlay = document.getElementById("popupOverlay");
const popupMessage = document.getElementById("popupMessage");
const difficultySection = document.getElementById("difficultySection");

let primeCount = 0;
let foundCount = 0;
let timerInterval;
let timeLeft = 25;
let currentDifficulty = "easy";

// Check if a number is prime
function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

// Get random odd number based on difficulty
function getRandomOdd() {
  let min, max;

  if (currentDifficulty === "easy") {
    min = 300; max = 500;
  } else if (currentDifficulty === "normal") {
    min = 500; max = 1000;
  } else {
    min = 1000; max = 3000;
  }

  let num = Math.floor(Math.random() * ((max - min) / 2 + 1)) * 2 + min;
  return num % 2 === 0 ? num + 1 : num;
}

// Start the game
function startGame() {
  // Read selected difficulty
  const selected = document.querySelector('input[name="difficulty"]:checked');
  currentDifficulty = selected ? selected.value : "easy";

  // Hide difficulty and start button
  difficultySection.style.display = "none";
  startButton.style.display = "none";

  // Show UI elements
  grid.style.display = "grid";
  timerElement.style.display = "block";
  doneWrapper.style.display = "block";

  // Show difficulty label
  difficultyLabel.textContent = `Difficulty: ${currentDifficulty.toUpperCase()}`;
  difficultyLabel.style.display = "block";

  generateGrid();
}


// Generate valid subrange with at least 25 odd numbers
function getValidSubrange(min, max) {
  let subMin, subMax, oddNumbers;

  do {
    const subrangeSize = Math.floor(Math.random() * (65 - 40 + 1)) + 40; // random size 40–65
    subMin = Math.floor(Math.random() * (max - min - subrangeSize + 1)) + min;
    subMax = subMin + subrangeSize;

    // Collect odd numbers in subrange
    oddNumbers = [];
    for (let i = subMin; i <= subMax; i++) {
      if (i % 2 !== 0) oddNumbers.push(i);
    }
  } while (oddNumbers.length < 25); // ensure we have at least 25 odds

  return { subMin, subMax, oddNumbers };
}



// Create the 5x5 number grid
function generateGrid() {
  grid.innerHTML = "";
  primeCount = 0;
  foundCount = 0;
  startTimer();

  let min, max;
  if (currentDifficulty === "easy") {
    min = 300; max = 500;
  } else if (currentDifficulty === "normal") {
    min = 500; max = 1000;
  } else {
    min = 1000; max = 3000;
  }
  

  // Get valid subrange with at least 25 odd numbers
  const { subMin, subMax, oddNumbers } = getValidSubrange(min, max);

  // Show subrange to user
  document.getElementById("subrangeLabel").textContent = `🔍 Subrange: ${subMin} – ${subMax}`;
  document.getElementById("subrangeLabel").style.display = "block";

  // Shuffle and pick 25 for grid
  const gridNumbers = oddNumbers.sort(() => 0.5 - Math.random()).slice(0, 25);

  gridNumbers.forEach(number => {
    const square = document.createElement("div");
    square.classList.add("square");

    square.textContent = number;
    const prime = isPrime(number);
    square.dataset.isPrime = prime;
    square.dataset.clicked = "false";

    if (prime) primeCount++;

    square.addEventListener("click", function () {
      if (square.dataset.clicked === "true") return;

      if (square.dataset.isPrime === "true") {
        square.style.backgroundColor = "#00b894";
        square.classList.add("disabled");
        square.style.pointerEvents = "none";
        square.dataset.clicked = "true";
        // square.style.fontSize = "32px";
        foundCount++;
      } else {
        square.style.backgroundColor = "#d63031";
        showPopup("❌ Wrong guess! Game will restart.", true);
      }
    });

    grid.appendChild(square);
  });
}



// Start 25-second countdown
function startTimer() {
  timeLeft = 500;
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

// Show a popup message
function showPopup(message, restart = false) {
  popupMessage.textContent = message;
  popupOverlay.style.display = "flex"; // important!
  popupOverlay.dataset.restart = restart;
  clearInterval(timerInterval);
}


// Restart from current difficulty
function restartGame() {
  popupOverlay.style.display = "none";
  startGame();
}

// Go to home screen (Start + Difficulty)
function goHome() {
  popupOverlay.style.display = "none";
  grid.style.display = "none";
  timerElement.style.display = "none";
  doneWrapper.style.display = "none";
  startButton.style.display = "inline-block";
  difficultyLabel.style.display = "none";
  difficultySection.style.display = "block";
}

// When user clicks "Done"
function checkResult() {
  if (foundCount === primeCount) {
    showPopup("🏆 You found all the primes! You won!", true);
  } else {
    showPopup(`🚫 You missed some! Found ${foundCount} of ${primeCount}.`, true);
  }
}
