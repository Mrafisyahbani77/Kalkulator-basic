let runningTotal = 0;
let buffer = "0";
let previousOperator = null;
const history = [];

const screen = document.querySelector('.screen');
const historyList = document.querySelector('.history-list');
const clearHistoryButton = document.querySelector('.clear-history');

function buttonClick(value) {
    if (isNaN(value)) {
        handleSymbol(value);
    } else {
        handleNumber(value);
    }
    screen.innerText = buffer;  // Update the screen with the current buffer
}

function handleSymbol(symbol) {
    switch (symbol) {
        case 'C':
            buffer = '0';
            runningTotal = 0;
            previousOperator = null;
            break;
        case '=':
            if (previousOperator === null) {
                return;
            }
            flushOperation(parseFloat(buffer));
            previousOperator = null;
            buffer = `${runningTotal}`;
            addToHistory(buffer);
            runningTotal = 0;
            break;
        case '←':
            if (buffer.length === 1 || buffer === '0') {
                buffer = '0';
            } else {
                buffer = buffer.slice(0, -1);
            }
            break;
        case '+':
        case '-':
        case '×':
        case '÷':
            handleMath(symbol);
            break;
    }
}

function handleMath(symbol) {
    if (buffer === '0') {
        return;
    }

    const intBuffer = parseFloat(buffer);

    if (previousOperator !== null) {
        flushOperation(intBuffer);
    } else {
        runningTotal = intBuffer;
    }

    previousOperator = symbol;
    buffer = '0';  // Reset buffer to start new number entry
}

function flushOperation(intBuffer) {
    if (previousOperator === '+') {
        runningTotal += intBuffer;
    } else if (previousOperator === '-') {
        runningTotal -= intBuffer;
    } else if (previousOperator === '×') {
        runningTotal *= intBuffer;
    } else if (previousOperator === '÷') {
        runningTotal /= intBuffer;
    }
}

function handleNumber(numberString) {
    if (buffer === '0') {
        buffer = numberString;
    } else {
        buffer += numberString;
    }
}

function addToHistory(entry) {
    history.push(entry);
    const historyItem = document.createElement('li');
    historyItem.innerText = entry;
    historyList.appendChild(historyItem);
    saveHistory();
}

function saveHistory() {
    localStorage.setItem('calcHistory', JSON.stringify(history));
}

function loadHistory() {
    const savedHistory = localStorage.getItem('calcHistory');
    if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        parsedHistory.forEach(entry => {
            history.push(entry);
            const historyItem = document.createElement('li');
            historyItem.innerText = entry;
            historyList.appendChild(historyItem);
        });
    }
}

function clearHistory() {
    history.length = 0;
    historyList.innerHTML = '';
    localStorage.removeItem('calcHistory');
}

function init() {
    document.querySelector('.calc-buttons')
        .addEventListener('click', function(event) {
            buttonClick(event.target.innerText);
        });

    clearHistoryButton.addEventListener('click', clearHistory);

    loadHistory();
}

init();
