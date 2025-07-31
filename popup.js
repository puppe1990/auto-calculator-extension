const expressionInput = document.getElementById("expression");
const resultDiv = document.getElementById("result");

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
    
    // Format the result nicely
    let formattedResult = result;
    if (typeof result === 'number') {
        // Check if it's an integer
        if (Number.isInteger(result)) {
            formattedResult = result.toLocaleString();
        } else {
            // Limit decimal places for better display
            formattedResult = parseFloat(result.toFixed(6)).toLocaleString();
        }
    }
    
    resultDiv.innerHTML = `
        <div class="flex items-center justify-end">
            <span class="text-2xl font-bold text-gray-800">= ${formattedResult}</span>
        </div>
    `;
}

// Function to calculate expression
function calculateExpression(expr) {
    try {
        if (expr.trim() === "") {
            updateResult("");
            return;
        }
        
        // Basic validation - only allow safe mathematical expressions
        const sanitizedExpr = expr.replace(/[^0-9+\-*/().\s]/g, '');
        const result = eval(sanitizedExpr);
        
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
});

// Handle Enter key
expressionInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const expr = expressionInput.value;
        calculateExpression(expr);
    }
});

// Example buttons functionality
document.addEventListener("DOMContentLoaded", () => {
    const exampleButtons = document.querySelectorAll(".example-btn");
    
    exampleButtons.forEach(button => {
        button.addEventListener("click", () => {
            const example = button.getAttribute("data-example");
            expressionInput.value = example;
            expressionInput.focus();
            calculateExpression(example);
            
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