const grid = document.getElementById("grid");
const timerElement = document.getElementById("timer");
const doneWrapper = document.getElementById("doneWrapper");
const startButton = document.getElementById("startButton");
const popupOverlay = document.getElementById("popupOverlay");
const popupMessage = document.getElementById("popupMessage");

let primeCount = 0;
let foundCount = 0;
let timerInterval;
let timeLeft = 25; 

// Show popup
function showPopup(message, restart = false) {
  popupMessage.textContent = message;
  popupOverlay.style.display = "flex";
  popupOverlay.dataset.restart = restart;
  clearInterval(timerInterval);
}

// Close popup and restart if needed
function closePopup() {
  popupOverlay.style.display = "none";
  if (popupOverlay.dataset.restart === "true") {
    startGame(); // Go back to fresh game
  }
}

// Start Game: Show elements and generate grid
function startGame() {
  startButton.style.display = "none";
  grid.style.display = "grid";
  timerElement.style.display = "block";
  doneWrapper.style.display = "block";
  generateGrid();
  

}

// Timer logic
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

// Prime check
function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

// Generate random odd number
function getRandomOdd() {
    let num = Math.floor(Math.random() * 125) * 2 + 51; // range: 51 to 299
    return num;
  }
  

// Generate grid and start timer
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

// Done button logic
function checkResult() {
  if (foundCount === primeCount) {
    showPopup("🏆 You found all the primes! You won!", true);
  } else {
    showPopup(`🚫 You missed some! Found ${foundCount} of ${primeCount}.`, true);
  }
}




function restartGame() {
    popupOverlay.style.display = "none";
    startGame(); // Restart immediately
  }
  
  function goHome() {
    popupOverlay.style.display = "none";
    grid.style.display = "none";
    timerElement.style.display = "none";
    doneWrapper.style.display = "none";
    startButton.style.display = "inline-block"; // Show start button again
  }
  

  
  