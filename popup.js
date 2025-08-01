const expressionInput = document.getElementById("expression");
const resultDiv = document.getElementById("result");

// Currency mode state
let currentMode = 'brl'; // Default to BRL mode

// Function to save data to Chrome storage
function saveData() {
    const data = {
        expression: expressionInput.value,
        result: resultDiv.innerHTML,
        timestamp: Date.now(),
        currencyMode: currentMode
    };
    chrome.storage.local.set({ 'calculatorData': data });
}

// Function to load data from Chrome storage
function loadData() {
    chrome.storage.local.get(['calculatorData'], (result) => {
        if (result.calculatorData) {
            const data = result.calculatorData;
            // Only restore if data is less than 24 hours old
            if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
                expressionInput.value = data.expression || '';
                resultDiv.innerHTML = data.result || '<span class="text-gray-400 text-sm">Ready to calculate...</span>';
                
                // Restore currency mode
                if (data.currencyMode) {
                    setCurrencyMode(data.currencyMode);
                }
                
                // Recalculate if there's an expression
                if (data.expression && data.expression.trim() !== '') {
                    calculateExpression(data.expression);
                }
            }
        }
    });
}

// Function to set currency mode
function setCurrencyMode(mode) {
    currentMode = mode;
    const usdBtn = document.getElementById('usd-mode');
    const brlBtn = document.getElementById('brl-mode');
    
    if (mode === 'usd') {
        // USD active state
        usdBtn.classList.add('bg-gradient-to-r', 'from-blue-500', 'to-blue-600', 'text-white', 'shadow-lg', 'border-2', 'border-blue-400', 'transform', 'scale-105');
        usdBtn.classList.remove('text-gray-500', 'text-gray-700', 'hover:bg-gray-100');
        
        // BRL inactive state
        brlBtn.classList.remove('bg-gradient-to-r', 'from-blue-500', 'to-blue-600', 'text-white', 'shadow-lg', 'border-2', 'border-blue-400', 'transform', 'scale-105');
        brlBtn.classList.add('text-gray-500', 'hover:bg-gray-100');
    } else {
        // BRL active state
        brlBtn.classList.add('bg-gradient-to-r', 'from-blue-500', 'to-blue-600', 'text-white', 'shadow-lg', 'border-2', 'border-blue-400', 'transform', 'scale-105');
        brlBtn.classList.remove('text-gray-500', 'text-gray-700', 'hover:bg-gray-100');
        
        // USD inactive state
        usdBtn.classList.remove('bg-gradient-to-r', 'from-blue-500', 'to-blue-600', 'text-white', 'shadow-lg', 'border-2', 'border-blue-400', 'transform', 'scale-105');
        usdBtn.classList.add('text-gray-500', 'hover:bg-gray-100');
    }
    
    // Update placeholder text based on mode
    if (mode === 'usd') {
        expressionInput.placeholder = "Enter your calculation (e.g., 3.14 + 2.5)...";
    } else {
        expressionInput.placeholder = "Enter your calculation (e.g., 3,14 + 2,5)...";
    }
    
    // Recalculate current expression with new mode
    if (expressionInput.value.trim() !== '') {
        calculateExpression(expressionInput.value);
    }
}

// Function to process input based on currency mode
function processInputForMode(input) {
    if (currentMode === 'brl') {
        // For BRL mode, convert commas to dots for calculation
        return input.replace(/,/g, '.');
    }
    // For USD mode, keep dots as they are
    return input;
}

// Function to format output based on currency mode
function formatOutputForMode(number) {
    if (typeof number !== 'number') return number;
    
    if (currentMode === 'brl') {
        // For BRL mode, format with comma as decimal separator
        return number.toString().replace('.', ',');
    }
    // For USD mode, keep dot as decimal separator
    return number.toString();
}

// Function to update result display with beautiful styling
function updateResult(result, isError = false) {
    if (result === null || result === undefined || result === "") {
        resultDiv.innerHTML = '<span class="text-gray-400 text-sm">Ready to calculate...</span>';
        return;
    }
    
    if (isError) {
        resultDiv.innerHTML = `
            <div class="flex items-center justify-end">
                <span class="text-red-500 text-sm font-medium">${result}</span>
            </div>
        `;
        return;
    }
    
    // Format the result nicely based on currency mode
    let formattedResult = result;
    if (typeof result === 'number') {
        // Check if it's an integer
        if (Number.isInteger(result)) {
            formattedResult = result.toLocaleString();
        } else {
            // Limit decimal places for better display
            const fixedResult = parseFloat(result.toFixed(6));
            formattedResult = formatOutputForMode(fixedResult);
        }
    }
    
    resultDiv.innerHTML = `
        <div class="flex items-center justify-end">
            <span class="text-2xl font-bold text-gray-800">= ${formattedResult}</span>
        </div>
    `;
}

// Safe mathematical expression parser
function parseExpression(expr) {
    // Remove all spaces
    expr = expr.replace(/\s/g, '');
    
    // Tokenize the expression
    const tokens = expr.match(/(\d+\.?\d*|[+\-*/()])/g) || [];
    
    // Convert to postfix notation (Reverse Polish Notation)
    const output = [];
    const operators = [];
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };
    
    for (let token of tokens) {
        if (/\d/.test(token)) {
            output.push(parseFloat(token));
        } else if (token === '(') {
            operators.push(token);
        } else if (token === ')') {
            while (operators.length > 0 && operators[operators.length - 1] !== '(') {
                output.push(operators.pop());
            }
            if (operators.length > 0 && operators[operators.length - 1] === '(') {
                operators.pop();
            }
        } else {
            while (operators.length > 0 && 
                   operators[operators.length - 1] !== '(' && 
                   precedence[operators[operators.length - 1]] >= precedence[token]) {
                output.push(operators.pop());
            }
            operators.push(token);
        }
    }
    
    while (operators.length > 0) {
        output.push(operators.pop());
    }
    
    return output;
}

// Evaluate postfix expression
function evaluatePostfix(postfix) {
    const stack = [];
    
    for (let token of postfix) {
        if (typeof token === 'number') {
            stack.push(token);
        } else {
            const b = stack.pop();
            const a = stack.pop();
            
            switch (token) {
                case '+': stack.push(a + b); break;
                case '-': stack.push(a - b); break;
                case '*': stack.push(a * b); break;
                case '/': 
                    if (b === 0) throw new Error('Division by zero');
                    stack.push(a / b); 
                    break;
                default: throw new Error('Invalid operator');
            }
        }
    }
    
    return stack[0];
}

// Function to calculate expression
function calculateExpression(expr) {
    try {
        if (expr.trim() === "") {
            updateResult("");
            return;
        }
        
        // Clean the expression - remove extra spaces and validate
        let cleanExpr = expr.trim();
        
        // Process input based on currency mode
        cleanExpr = processInputForMode(cleanExpr);
        
        // Remove any non-mathematical characters except spaces
        cleanExpr = cleanExpr.replace(/[^0-9+\-*/().\s]/g, '');
        
        // Check for balanced parentheses
        const openParens = (cleanExpr.match(/\(/g) || []).length;
        const closeParens = (cleanExpr.match(/\)/g) || []).length;
        if (openParens !== closeParens) {
            updateResult("Invalid expression", true);
            return;
        }
        
        // Ensure the expression doesn't end with operators
        if (/[+\-*/]$/.test(cleanExpr)) {
            updateResult("Invalid expression", true);
            return;
        }
        
        // Additional check: ensure we have at least one number
        if (!/\d/.test(cleanExpr)) {
            updateResult("Invalid expression", true);
            return;
        }
        
        // Parse and evaluate the expression safely
        const postfix = parseExpression(cleanExpr);
        const result = evaluatePostfix(postfix);
        
        if (typeof result === 'number' && isFinite(result)) {
            updateResult(result);
        } else {
            updateResult("Invalid expression", true);
        }
    } catch (error) {
        updateResult("Invalid expression", true);
    }
}

// Main input event listener
expressionInput.addEventListener("input", () => {
    const expr = expressionInput.value;
    calculateExpression(expr);
    // Save data after each input change
    saveData();
});

// Handle Enter key
expressionInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const expr = expressionInput.value;
        calculateExpression(expr);
        saveData();
    }
});

// Example buttons functionality
document.addEventListener("DOMContentLoaded", () => {
    // Load saved data when popup opens
    loadData();
    
    // Set up currency mode buttons
    const usdBtn = document.getElementById('usd-mode');
    const brlBtn = document.getElementById('brl-mode');
    
    usdBtn.addEventListener("click", () => {
        setCurrencyMode('usd');
        saveData();
    });
    
    brlBtn.addEventListener("click", () => {
        setCurrencyMode('brl');
        saveData();
    });
    
    const exampleButtons = document.querySelectorAll(".example-btn");
    
    exampleButtons.forEach(button => {
        button.addEventListener("click", () => {
            const example = button.getAttribute("data-example");
            expressionInput.value = example;
            expressionInput.focus();
            calculateExpression(example);
            saveData();
            
            // Add a subtle animation to the button
            button.classList.add("scale-95");
            setTimeout(() => {
                button.classList.remove("scale-95");
            }, 150);
        });
    });
    
    // Focus on input when popup opens
    expressionInput.focus();
});

// Add smooth transitions for better UX
expressionInput.addEventListener("focus", () => {
    expressionInput.classList.add("ring-4", "ring-blue-100");
});

expressionInput.addEventListener("blur", () => {
    expressionInput.classList.remove("ring-4", "ring-blue-100");
});

// Save data when popup is about to close
window.addEventListener("beforeunload", () => {
    saveData();
});