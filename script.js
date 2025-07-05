const grid = document.getElementById("grid");
const popupOverlay = document.getElementById("popupOverlay");
const popupMessage = document.getElementById("popupMessage");
const timerElement = document.getElementById("timer");

let primeCount = 0;
let foundCount = 0;
let timerInterval;
let timeLeft = 15;

function showPopup(message, restart = false) {
  popupMessage.textContent = message;
  popupOverlay.style.display = "flex";
  popupOverlay.dataset.restart = restart;
  clearInterval(timerInterval); // Stop timer on popup
}

function closePopup() {
  popupOverlay.style.display = "none";
  if (popupOverlay.dataset.restart === "true") {
    generateGrid();
  }
}

function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function getRandomOdd() {
  return Math.floor(Math.random() * 50) * 2 + 1;
}

function startTimer() {
  timeLeft = 15;
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

function generateGrid() {
  grid.innerHTML = "";
  primeCount = 0;
  foundCount = 0;
  startTimer();

  for (let i = 0; i < 25; i++) {
    const square = document.createElement("div");
    square.classList.add("square");

    const randomNum = getRandomOdd();
    square.textContent = randomNum;

    const prime = isPrime(randomNum);
    if (prime) primeCount++;

    square.dataset.isPrime = prime;
    square.dataset.clicked = "false";

    square.addEventListener("click", function () {
      if (square.dataset.clicked === "true") return;

      if (square.dataset.isPrime === "true") {
        square.style.backgroundColor = "#00b894";
        square.classList.add("disabled");
        square.style.pointerEvents = "none";
        square.dataset.clicked = "true";
        square.innerHTML = "✓";
        square.style.fontSize = "32px";
        foundCount++;
      } else {
        square.style.backgroundColor = "#d63031";
        showPopup("❌ Wrong guess! Game will restart.", true);
      }
    });

    grid.appendChild(square);
  }
}

function checkResult() {
  if (foundCount === primeCount) {
    showPopup("🏆 You found all the primes! You won!", true);
  } else {
    showPopup(`🚫 You missed some! Found ${foundCount} of ${primeCount}.`, true);
  }
}

// Start game initially
generateGrid();
