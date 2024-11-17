const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
let cards = [];
let flippedCards = [];
let score = 0;
let matches = 0;
let timer;
let time = 0;
let level = 1;
let timeLimit;

const baseSymbols = ["🍎", "🍌", "🍓", "🍇", "🍉", "🍒", "🍍", "🍑", "🍋", "🥝", "🍐", "🍊", "🍈", "🥭", "🍏", "🍉"];
let cardSymbols = []; // Array to store symbols for each level

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function createCard(symbol) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front">${symbol}</div>
            <div class="card-back"></div>
        </div>
    `;
    card.addEventListener('click', () => flipCard(card, symbol));
    return card;
}

function flipCard(card, symbol) {
    if (flippedCards.length === 2 || card.classList.contains('flip')) return;

    card.classList.add('flip');
    flippedCards.push({ card, symbol });

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [firstCard, secondCard] = flippedCards;
    if (firstCard.symbol === secondCard.symbol) {
        score += 10;
        matches += 1;
        scoreElement.textContent = score;
        flippedCards = [];

        if (matches === cardSymbols.length / 2) {
            clearInterval(timer);
            setTimeout(() => alert(`Level ${level} Complete!`), 100);
            levelUp();
        }
    } else {
        setTimeout(() => {
            firstCard.card.classList.remove('flip');
            secondCard.card.classList.remove('flip');
            flippedCards = [];
        }, 1000);
    }
}

function startTimer() {
    time = timeLimit;
    timer = setInterval(() => {
        time -= 1;
        timerElement.textContent = time;

        if (time <= 0) {
            clearInterval(timer);
            alert(`Time's up! You reached Level ${level}.`);
            restartGame();
        }
    }, 1000);
}

function setupLevel() {
    const gridSize = Math.min(level + 3, 10); // Increase grid size up to 10x10
    cardSymbols = shuffle([...baseSymbols, ...baseSymbols]).slice(0, (gridSize * gridSize) / 2);
    cardSymbols = [...cardSymbols, ...cardSymbols]; // Duplicate for pairs
    cardSymbols = shuffle(cardSymbols);

    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    gameBoard.innerHTML = '';
    cardSymbols.forEach(symbol => {
        const card = createCard(symbol);
        gameBoard.appendChild(card);
    });
}

function startGame() {
    score = 0;
    level = 1;
    startLevel();
}

function levelUp() {
    level += 1;
    startLevel();
}

function startLevel() {
    scoreElement.textContent = score;
    matches = 0;
    flippedCards = [];

    clearInterval(timer);

    // Increase time limit per level (e.g., 60 seconds for level 1, reducing by 1 second per level)
    timeLimit = Math.max(30, 60 - level);
    timerElement.textContent = timeLimit;

    setupLevel();
    startTimer();
}

function restartGame() {
    level = 1;
    score = 0;
    startGame();
}

// Initialize game
startGame();
