const passwordInput = document.getElementById('password');
const strengthLabel = document.getElementById('strength-label');
const progressBar = document.getElementById('progress-bar');
const suggestionsList = document.getElementById('suggestions');
const toggleBtn = document.getElementById('toggle-visibility');

const REQUIREMENTS = [
  { regex: /.{8,}/, text: "Make password at least 8 characters" },
  { regex: /[A-Z]/, text: "Add uppercase letters" },
  { regex: /[a-z]/, text: "Add lowercase letters" },
  { regex: /[0-9]/, text: "Add numbers" },
  { regex: /[^A-Za-z0-9]/, text: "Add special characters" }
];

function togglePasswordVisibility() {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleBtn.textContent = "Hide";
  } else {
    passwordInput.type = "password";
    toggleBtn.textContent = "Show";
  }
}

function checkStrength() {
  const password = passwordInput.value;
  
  if (password === "") {
    strengthLabel.textContent = "EMPTY";
    strengthLabel.style.color = "var(--text-dim)";
    progressBar.style.width = "0%";
    progressBar.style.backgroundColor = "var(--text-dim)";
    renderRequirements([]);
    return;
  }

  const passedCriteria = REQUIREMENTS.filter(req => req.regex.test(password));
  const score = passedCriteria.length;

  renderRequirements(passedCriteria);

  let strengthText = "WEAK";
  let color = "var(--color-weak)";
  let width = "33%";

  if (score === 5) {
    strengthText = "STRONG";
    color = "var(--color-strong)";
    width = "100%";
  } else if (score >= 3) {
    strengthText = "MEDIUM";
    color = "var(--color-mid)";
    width = "66%";
  }

  strengthLabel.textContent = strengthText;
  strengthLabel.style.color = color;
  progressBar.style.width = width;
  progressBar.style.backgroundColor = color;
}

function renderRequirements(passedCriteria) {
  suggestionsList.innerHTML = "";

  REQUIREMENTS.forEach(req => {
    const li = document.createElement('li');
    li.textContent = req.text;
    
    const isPassed = passedCriteria.includes(req);
    
    if (isPassed) {
      li.style.color = "var(--color-strong)";
      li.style.textDecoration = "line-through";
      li.style.opacity = "0.6";
    } else {
      li.style.color = "var(--text-color)";
    }

    suggestionsList.appendChild(li);
  });
}

function generatePassword() {
  const length = 16;
  const charset = {
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lower: "abcdefghijklmnopqrstuvwxyz",
    number: "0123456789",
    special: "!@#$%^&*()_+~`|}{[]:;?><,./-="
  };

  let passwordArray = [
    charset.upper[crypto.getRandomValues(new Uint32Array(1))[0] % charset.upper.length],
    charset.lower[crypto.getRandomValues(new Uint32Array(1))[0] % charset.lower.length],
    charset.number[crypto.getRandomValues(new Uint32Array(1))[0] % charset.number.length],
    charset.special[crypto.getRandomValues(new Uint32Array(1))[0] % charset.special.length]
  ];

  const allChars = charset.upper + charset.lower + charset.number + charset.special;
  const typedArray = new Uint32Array(length - 4);
  crypto.getRandomValues(typedArray);

  for (let i = 0; i < typedArray.length; i++) {
    passwordArray.push(allChars[typedArray[i] % allChars.length]);
  }

  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }

  passwordInput.value = passwordArray.join('');
  checkStrength();
}

document.addEventListener('DOMContentLoaded', () => {
  checkStrength();
});