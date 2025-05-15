// Výber displeja kalkulačky / Select the calculator display
const display = document.getElementById('display');

// Premenné pre výrazy a stav / Variables for expression and state
let expression = '';            // matematický výraz / full math expression
let isResultDisplayed = false; // bol práve zobrazený výsledok? / was result just shown
let clearNextInput = false;    // vyčistiť displej pred ďalším číslom? / should we clear display on next input

// Funkcia na pridanie znaku (čísla alebo operátora) / Append digit or operator
function append(value) {
  if (isResultDisplayed) {
    if (isOperator(value)) {
      expression = display.value + value;
      clearNextInput = true;
    } else {
      display.value = value;
      expression = value;
    }
    isResultDisplayed = false;
    return;
  }

  if (clearNextInput) {
    display.value = value;
    clearNextInput = false;
    expression += value;
    return;
  }

  // Obmedzenie dĺžky čísla / Limit display length
  if (display.value.length >= display.maxLength && !isOperator(value)) {
    return;
  }

  // Pridanie operátora do výrazu / Add operator to expression only
  if (isOperator(value)) {
    expression += value;
    clearNextInput = true;
    return;
  }

  // Normálne pridanie čísla / Normal digit entry
  if (display.value === '0') {
    display.value = value;
    expression += value;
  } else {
    display.value += value;
    expression += value;
  }
}

// Zistenie, či znak je operátor / Check if character is operator
function isOperator(char) {
  return ['+', '-', '*', '/', '%', '.'].includes(char);
}

// Vymazanie všetkého / Clear display and expression
function clearDisplay() {
  display.value = '0';
  expression = '';
  isResultDisplayed = false;
  clearNextInput = false;
}

// Vymazanie posledného znaku / Delete last character
function deleteLast() {
  if (isResultDisplayed || clearNextInput) {
    clearDisplay();
    return;
  }

  if (expression.length > 1) {
    expression = expression.slice(0, -1);
    display.value = display.value.slice(0, -1);
  } else {
    clearDisplay();
  }
}

// Výpočet matematického výrazu / Evaluate the expression
function calculate() {
  try {
    const result = eval(expression);
    display.value = result.toString();
    expression = result.toString();
    isResultDisplayed = true;
    clearNextInput = false;
  } catch {
    display.value = 'Error';
    expression = '';
    isResultDisplayed = true;
    clearNextInput = false;
  }
}

// Výpočet percenta / Calculate percentage
function percent() {
  try {
    const operators = ['+', '-', '*', '/'];
    let operatorIndex = -1;

    // Nájdi posledný operátor vo výraze / Find last operator
    for (let i = expression.length - 1; i >= 0; i--) {
      if (operators.includes(expression[i])) {
        operatorIndex = i;
        break;
      }
    }

    if (operatorIndex === -1) {
      const value = parseFloat(expression);
      display.value = (value / 100).toString();
      expression = display.value;
      return;
    }

    const first = parseFloat(expression.slice(0, operatorIndex));
    const operator = expression[operatorIndex];
    const second = parseFloat(expression.slice(operatorIndex + 1));

    if (isNaN(first) || isNaN(second)) {
      display.value = 'Error';
      return;
    }

    let result;
    if (operator === '+' || operator === '-') {
      result = eval(`${first} ${operator} ${first * (second / 100)}`);
    } else {
      result = eval(`${first} ${operator} ${second / 100}`);
    }

    display.value = result.toString();
    expression = display.value;
    isResultDisplayed = true;
    clearNextInput = false;
  } catch {
    display.value = 'Error';
    expression = '';
    isResultDisplayed = true;
    clearNextInput = false;
  }
}

// Ovládanie kalkulačky klávesnicou / Keyboard input support
document.addEventListener('keydown', function (e) {
  const key = e.key;

  if (!isNaN(key)) {
    append(key); 
  } else if (['+', '-', '*', '/'].includes(key)) {
    append(key); 
  } else if (key === 'Enter' || key === '=') {
    calculate(); 
  } else if (key === 'Backspace') {
    deleteLast(); 
  } else if (key === 'Escape') {
    clearDisplay(); 
  } else if (key === '%') {
    percent(); 
  } else if (key === '.') {
    append('.'); 
  }
});
