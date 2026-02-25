const numbersContainer = document.querySelector('lotto-numbers');
const generateBtn = document.querySelector('#generate-btn');
const themeToggle = document.querySelector('#theme-toggle');

if (!numbersContainer || !generateBtn || !themeToggle) {
  throw new Error('Required elements not found');
}

function generateLottoNumbers() {
  const selected = new Set();
  while (selected.size < 6) {
    const n = Math.floor(Math.random() * 45) + 1;
    selected.add(n);
  }
  return Array.from(selected).sort((a, b) => a - b);
}

function renderNumbers(numbers) {
  numbersContainer.innerHTML = '';
  numbers.forEach((num) => {
    const span = document.createElement('span');
    span.textContent = String(num);
    span.className = 'lotto-ball';
    numbersContainer.appendChild(span);
  });
}

generateBtn.addEventListener('click', () => {
  renderNumbers(generateLottoNumbers());
});

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  const isLight = theme === 'light';
  const label = isLight ? 'Switch to dark mode' : 'Switch to light mode';
  themeToggle.setAttribute('aria-label', label);
  themeToggle.setAttribute('title', label);
  themeToggle.setAttribute('aria-pressed', String(isLight));
}

const savedTheme = localStorage.getItem('theme');
applyTheme(savedTheme === 'light' ? 'light' : 'dark');

themeToggle.addEventListener('click', () => {
  const nextTheme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', nextTheme);
  applyTheme(nextTheme);
});
