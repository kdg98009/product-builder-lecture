const todayDate = document.querySelector('#today-date');
const salesForm = document.querySelector('#sales-form');
const drinkNameInput = document.querySelector('#drink-name');
const drinkCountInput = document.querySelector('#drink-count');
const totalCountEl = document.querySelector('#total-count');
const drinkKindsEl = document.querySelector('#drink-kinds');
const salesTableBody = document.querySelector('#sales-table-body');
const resetBtn = document.querySelector('#reset-btn');
const themeToggle = document.querySelector('#theme-toggle');
const partnershipForm = document.querySelector('#partnership-form');
const partnershipSubmitBtn = document.querySelector('#partnership-submit');
const partnershipStatus = document.querySelector('#partnership-status');

if (
  !todayDate ||
  !salesForm ||
  !drinkNameInput ||
  !drinkCountInput ||
  !totalCountEl ||
  !drinkKindsEl ||
  !salesTableBody ||
  !resetBtn ||
  !themeToggle ||
  !partnershipForm ||
  !partnershipSubmitBtn ||
  !partnershipStatus
) {
  throw new Error('Required elements not found');
}

const STORAGE_KEY = 'drink-sales-by-day-v1';

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${date}`;
}

function loadSalesStore() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveSalesStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

const todayKey = getTodayKey();
todayDate.textContent = todayKey;

const salesStore = loadSalesStore();
if (!salesStore[todayKey] || typeof salesStore[todayKey] !== 'object') {
  salesStore[todayKey] = {};
}

function renderSummaryAndTable() {
  const todaySales = salesStore[todayKey];
  const entries = Object.entries(todaySales).sort((a, b) => b[1] - a[1]);
  const totalCount = entries.reduce((sum, [, count]) => sum + count, 0);

  totalCountEl.textContent = String(totalCount);
  drinkKindsEl.textContent = String(entries.length);

  salesTableBody.innerHTML = '';
  if (entries.length === 0) {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = '<td colspan="2" class="empty-row">아직 등록된 판매 내역이 없습니다.</td>';
    salesTableBody.appendChild(emptyRow);
    return;
  }

  entries.forEach(([drinkName, count]) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${drinkName}</td><td>${count}</td>`;
    salesTableBody.appendChild(row);
  });
}

salesForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const drinkName = drinkNameInput.value.trim();
  const count = Number(drinkCountInput.value);

  if (!drinkName || !Number.isInteger(count) || count < 1) {
    return;
  }

  const prev = salesStore[todayKey][drinkName] || 0;
  salesStore[todayKey][drinkName] = prev + count;
  saveSalesStore(salesStore);
  renderSummaryAndTable();

  drinkNameInput.value = '';
  drinkCountInput.value = '1';
  drinkNameInput.focus();
});

resetBtn.addEventListener('click', () => {
  const shouldReset = window.confirm('오늘 집계를 모두 초기화할까요?');
  if (!shouldReset) {
    return;
  }

  salesStore[todayKey] = {};
  saveSalesStore(salesStore);
  renderSummaryAndTable();
});

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  const isLight = theme === 'light';
  themeToggle.textContent = isLight ? 'Light Mode' : 'Dark Mode';
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

partnershipForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  partnershipSubmitBtn.disabled = true;
  partnershipSubmitBtn.textContent = '전송 중...';
  partnershipStatus.textContent = '';
  partnershipStatus.className = 'form-status';

  try {
    const response = await fetch(partnershipForm.action, {
      method: 'POST',
      body: new FormData(partnershipForm),
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Form submission failed');
    }

    partnershipForm.reset();
    partnershipStatus.textContent = '문의가 접수되었습니다. 확인 후 연락드리겠습니다.';
    partnershipStatus.classList.add('is-success');
  } catch {
    partnershipStatus.textContent = '전송에 실패했습니다. 잠시 후 다시 시도해주세요.';
    partnershipStatus.classList.add('is-error');
  } finally {
    partnershipSubmitBtn.disabled = false;
    partnershipSubmitBtn.textContent = '문의 보내기';
  }
});

renderSummaryAndTable();
