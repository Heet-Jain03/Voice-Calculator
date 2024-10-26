const startButton = document.getElementById('start-button');
const resultDiv = document.getElementById('result');
const historyList = document.getElementById('history-list');
const clearHistoryButton = document.querySelector('.clear-history');
const usernameDisplay = document.getElementById('username-display');

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.interimResults = false;
recognition.lang = 'en-US';

// Display the username if available
function displayUsername() {
    const username = sessionStorage.getItem('sessionUser');
    usernameDisplay.textContent = username ? `Welcome, ${username}!` : ''; 
}

// Initialize username display on page load
window.onload = displayUsername;

// Start speech recognition
startButton.addEventListener('click', () => {
    recognition.start();
    updateResult('', 'Listening...');
    startButton.disabled = true;
});

// Handle speech recognition results
recognition.addEventListener('result', (event) => {
    const transcript = event.results[0][0].transcript;
    updateResult(`You said: ${transcript}`, '');
    calculateResult(transcript);
});

// Handle end of speech recognition
recognition.addEventListener('end', () => {
    const currentResult = resultDiv.querySelector('.result-text')?.textContent || '';
    updateResult(currentResult, '(Stopped listening)');
    startButton.disabled = false;
});

// Update button state while listening
recognition.addEventListener('start', () => {
    updateButtonState(true);
});

// Update button state function
function updateButtonState(isListening) {
    startButton.innerHTML = isListening
        ? `<span class="listening-indicator"></span>Listening...`
        : `<i class="fas fa-microphone"></i>Start Listening`;
}

// Update result display
function updateResult(mainText, statusText) {
    resultDiv.innerHTML = `
        ${mainText ? `<div class="result-text ${mainText.startsWith('Error:') ? 'error' : ''}">${mainText}</div>` : ''}
        ${statusText ? `<div class="result-status">${statusText}</div>` : ''}
    `;
}

// Main function to calculate result based on input
function calculateResult(input) {
    try {
        const lowerInput = input.toLowerCase().replace(/what is|calculate|find|tell me/g, '').trim();

        if (lowerInput.includes('percent of') || lowerInput.includes('% of')) {
            calculatePercentOf(lowerInput);
            return;
        }
        if (lowerInput.includes('square root of')) {
            calculateSquareRoot(lowerInput);
            return;
        }
        if (lowerInput.includes('square of')) {
            calculateSquare(lowerInput);
            return;
        }
        if (lowerInput.includes('celsius to fahrenheit')) {
            convertCelsiusToFahrenheit(lowerInput);
            return;
        }
        if (lowerInput.includes('fahrenheit to celsius')) {
            convertFahrenheitToCelsius(lowerInput);
            return;
        }

        evaluateExpression(lowerInput, input);
    } catch (error) {
        updateResult(`Error: ${error.message}`, '');
    }
}

// Calculate percent of a number
function calculatePercentOf(input) {
    let parts = input.includes('percent of') 
        ? input.split('percent of') 
        : input.split('% of');
    
    const value = extractNumber(parts[0]);
    const total = extractNumber(parts[1]);
    const result = (value / 100) * total;
    displayResult(`${value} percent of ${total} = ${result}`, result);
}

// Calculate square root
function calculateSquareRoot(input) {
    const value = extractNumber(input);
    const result = Math.sqrt(value);
    displayResult(`Square root of ${value} = ${result}`, result);
}

// Calculate square
function calculateSquare(input) {
    const value = extractNumber(input);
    const result = Math.pow(value, 2);
    displayResult(`Square of ${value} = ${result}`, result);
}

// Convert Celsius to Fahrenheit
function convertCelsiusToFahrenheit(input) {
    const value = extractNumber(input);
    const result = (value * 9 / 5) + 32;
    displayResult(`${value} Celsius to Fahrenheit = ${result}`, result);
}

// Convert Fahrenheit to Celsius
function convertFahrenheitToCelsius(input) {
    const value = extractNumber(input);
    const result = (value - 32) * 5 / 9;
    displayResult(`${value} Fahrenheit to Celsius = ${result}`, result);
}

// Evaluate mathematical expression
function evaluateExpression(lowerInput, originalInput) {
    const formattedInput = lowerInput
        .replace(/plus/g, '+')
        .replace(/minus/g, '-')
        .replace(/times/g, '*')
        .replace(/multiplied by/g, '*')
        .replace(/divided by/g, '/')
        .replace(/x/g, '*');

    const result = eval(formattedInput); // Use eval with caution
    displayResult(`${originalInput} = ${result}`, result);
}

// Extract number from input
function extractNumber(input) {
    const matches = input.match(/-?\d+(\.\d+)?/);
    return matches ? parseFloat(matches[0]) : 0;
}

// Display calculation result
function displayResult(resultText, result) {
    updateResult(resultText, '');
    resultDiv.classList.remove('error');
    addToHistory(resultText);
}

// Add calculation to history
function addToHistory(calculation) {
    const listItem = document.createElement('li');
    listItem.textContent = calculation;
    historyList.prepend(listItem);

    // Limit history to 10 items
    if (historyList.children.length > 10) {
        historyList.removeChild(historyList.lastChild);
    }
}

// Clear calculation history
clearHistoryButton.addEventListener('click', () => {
    while (historyList.firstChild) {
        historyList.removeChild(historyList.firstChild);
    }
});
