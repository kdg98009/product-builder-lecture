const numbersContainer = document.querySelector('lotto-numbers');
const generateBtn = document.querySelector('#generate-btn');

if (!numbersContainer || !generateBtn) {
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
