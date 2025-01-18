const form = document.getElementById('generator-form');
const charRange = document.getElementById('char-range');
const passwordInput = document.getElementById('password-input');
const pwStrengthResult = document.getElementById('pw-strength__result');
const pwStrengthIndicator = document.getElementById('pw-strength__indicator');
const submitButton = document.getElementById('submit-button');
const copyButton = document.getElementById('copy-button');
const copyLabel = document.getElementById('copy-label');
const checkboxes = document.querySelectorAll('.checkbox__input');

const maxChars = 20;
let activeCriteriaCount = 0;

// Global criteria object to track selected password criteria
const criteria = {
  lowercase: false,
  uppercase: false,
  numbers: false,
  symbols: false,
};

charRange.max = maxChars;

const handleSubmit = (e) => {
  e.preventDefault();

  // Ensure the password length is at least equal to the number of active criteria
  const charLength = Math.max(charRange.value, activeCriteriaCount);

  // Generate the password and update the input field
  passwordInput.value = generatePassword(charLength, criteria);

  // Calculate and display the password strength
  calcStrength(charLength, activeCriteriaCount);

  // Set the password input width
  passwordInput.max = charLength;
  passwordInput.style.maxWidth = `${charLength}ch`;

  // Set min charLength depending on amount of active criteria
  charLength < activeCriteriaCount ? (charLength = activeCriteriaCount) : charLength;
  updatRangeSlider(charLength);

  // Reset the copy label
  copyLabel.innerHTML = '';
};

const generatePassword = (charLength, criteria) => {
  let availableChars = '';

  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';

  // Collect available characters based on active criteria
  if (criteria.lowercase) availableChars += lowercase;
  if (criteria.uppercase) availableChars += uppercase;
  if (criteria.numbers) availableChars += numbers;
  if (criteria.symbols) availableChars += symbols;

  // Default to lowercase characters if no criteria are selected
  if (!availableChars) availableChars += lowercase;

  // Ensure at least one character from each selected category
  const requiredChars = [];
  if (criteria.lowercase)
    requiredChars.push(lowercase[Math.floor(Math.random() * lowercase.length)]);
  if (criteria.uppercase)
    requiredChars.push(uppercase[Math.floor(Math.random() * uppercase.length)]);
  if (criteria.numbers) requiredChars.push(numbers[Math.floor(Math.random() * numbers.length)]);
  if (criteria.symbols) requiredChars.push(symbols[Math.floor(Math.random() * symbols.length)]);

  // Fill the remaining password length with random characters
  while (requiredChars.length < charLength) {
    requiredChars.push(availableChars[Math.floor(Math.random() * availableChars.length)]);
  }

  // Shuffle the password to avoid predictable patterns
  return requiredChars.sort(() => Math.random() - 0.5).join('');
};

const calcStrength = (charLength, criteriaCount) => {
  // Calculate password strength based on length and number of criteria
  const passwordStrength = charLength * criteriaCount;
  let strengthResult = '';
  let strengthIndicatorClass = '';

  if (passwordStrength < 14) {
    strengthResult = 'Too weak!';
    strengthIndicatorClass = 'pw-strength--danger';
  } else if (passwordStrength >= 15 && passwordStrength <= 29) {
    strengthResult = 'Weak';
    strengthIndicatorClass = 'pw-strength--weak';
  } else if (passwordStrength >= 30 && passwordStrength <= 59) {
    strengthResult = 'Medium';
    strengthIndicatorClass = 'pw-strength--medium';
  } else if (passwordStrength >= 60) {
    strengthResult = 'Strong';
    strengthIndicatorClass = 'pw-strength--strong';
  }

  // Display the strength result and apply the corresponding indicator class
  pwStrengthResult.innerHTML = strengthResult;
  pwStrengthIndicator.className = strengthIndicatorClass;
};

const updatRangeSlider = (value) => {
  // Update the slider value
  charRange.value = value;

  // Display the updated slider value
  charRange.previousElementSibling.innerHTML = value;

  // Adjust the slider's color gradient based on its value
  charRange.style.background = `linear-gradient(to right, #a4ffaf ${
    (value * 100) / maxChars
  }%,  #18171f ${(value * 100) / maxChars}%)`;
};

const activateSubmit = (value) => {
  // Enable or disable the submit button based on the input value
  submitButton.disabled = value === '0';
};

// Event listener for checkboxes to update criteria and adjust slider value
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('input', (e) => {
    const key = e.target.id; // The checkbox ID corresponds to the criteria key
    criteria[key] = e.target.checked;

    // Recalculate the active criteria count
    activeCriteriaCount = Object.values(criteria).filter(Boolean).length;

    // If the slider value is less than the number of active criteria, adjust it
    if (charRange.value < activeCriteriaCount) {
      updatRangeSlider(activeCriteriaCount);
    }

    // Update the submit button state
    activateSubmit(activeCriteriaCount);
  });
});

// Event listener for copying the generated password to the clipboard
copyButton.addEventListener('click', () => {
  copyLabel.innerHTML = 'copied';
  const password = passwordInput.value;
  if (password) navigator.clipboard.writeText(password);
});

// Event listener for range slider input
charRange.addEventListener('input', () => {
  updatRangeSlider(charRange.value);
  activateSubmit(charRange.value);
});

// Event listener for form submission
form.addEventListener('submit', handleSubmit);
