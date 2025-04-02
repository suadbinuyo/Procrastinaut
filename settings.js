
// Background selection
const bgOptions = document.querySelectorAll('.bg-option');
let currentBg = 'default';

bgOptions.forEach(option => {
  option.addEventListener('click', () => {
    bgOptions.forEach(opt => opt.classList.remove('active'));
    option.classList.add('active');
    currentBg = option.dataset.bg;
    updateBackground();
    savePreferences();
  });
});

function updateBackground() {
  const bgVar = `--bg-image-${currentBg}`;
  document.documentElement.style.setProperty('--bg-image', `var(${bgVar})`);
}

// Save preferences to localStorage
function savePreferences() {

  localStorage.setItem('backgroundPreference', currentBg);
}

// Load saved preferences
function loadPreferences() {
  const savedBg = localStorage.getItem('backgroundPreference');
  if (savedBg) {
    currentBg = savedBg;
    document.querySelector(`[data-bg="${currentBg}"]`).classList.add('active');
    updateBackground();
  }
}

// Initialize
loadPreferences();