// Полный список локаций
const allLocations = [
    "Пляж", "Школа", "Самолет", "Казино", 
    "Церковь", "Банк", "Ресторан", "Цирк", 
    "Больница", "Отель", "Поезд", "Театр", 
    "Полиция", "Супермаркет", "Университет", 
    "Военная база", "Космическая станция", "Океанский лайнер",
    "Подводная лодка", "Киностудия", "Стройка", "Рок-концерт"
];

let activeLocations = [...allLocations];
let players = [];
let currentPlayerIndex = 0;
let currentLocation = "";
let timerInterval;
let totalTimeSec = 0;

const screens = {
    setup: document.getElementById('setup-screen'),
    card: document.getElementById('card-screen'),
    game: document.getElementById('game-screen'),
    results: document.getElementById('results-screen')
};

// --- ТЕМА (DARK MODE) ---
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const btn = document.getElementById('theme-btn');
    const isDark = document.body.classList.contains('dark-mode');
    if (isDark) {
        btn.innerHTML = '<i class="ph-bold ph-sun"></i>';
    } else {
        btn.innerHTML = '<i class="ph-bold ph-moon"></i>';
    }
}

// --- УПРАВЛЕНИЕ ---
function updateValue(id, delta) {
    const input = document.getElementById(id + '-range');
    const display = document.getElementById((id === 'players' ? 'count-players-val' : id === 'spy' ? 'count-spy-val' : 'time-val'));
    
    let newVal = parseInt(input.value) + delta;
    if (newVal < parseInt(input.min)) newVal = parseInt(input.min);
    if (newVal > parseInt(input.max)) newVal = parseInt(input.max);
    
    if (id === 'spy') {
        const playersCount = parseInt(document.getElementById('players-range').value);
        if (newVal >= playersCount) newVal = playersCount - 1;
        if (newVal < 1) newVal = 1;
    }
    if (id === 'players') {
        const spyInput = document.getElementById('spy-range');
        const spyDisplay = document.getElementById('count-spy-val');
        if (parseInt(spyInput.value) >= newVal) {
            spyInput.value = newVal - 1;
            spyDisplay.innerText = newVal - 1;
        }
    }
    input.value = newVal;
    display.innerText = newVal;
}

function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    setTimeout(() => screens[name].classList.add('active'), 50);
}

// --- НАСТРОЙКИ ---
function openSettings() {
    document.getElementById('settings-modal').classList.add('open');
    renderSettingsList();
}
function closeSettings() {
    document.getElementById('settings-modal').classList.remove('open');
}
function renderSettingsList() {
    const list = document.getElementById('settings-locations-list');
    list.innerHTML = '';
    allLocations.sort().forEach(loc => {
        const li = document.createElement('li');
        const label = document.createElement('span');
        label.innerHTML = `<b>${loc}</b>`;
        const labelSwitch = document.createElement('label');
        labelSwitch.className = 'toggle-switch';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = activeLocations.includes(loc);
        checkbox.onchange = function() {
            if (this.checked) {
                if (!activeLocations.includes(loc)) activeLocations.push(loc);
            } else {
                if (activeLocations.length <= 2) {
                    this.checked = true;
                    alert("Нужно оставить хотя бы 2 локации!");
                    return;
                }
                activeLocations = activeLocations.filter(l => l !== loc);
            }
        };
        const slider = document.createElement('span');
        slider.className = 'slider';
        labelSwitch.appendChild(checkbox);
        labelSwitch.appendChild(slider);
        li.appendChild(label);
        li.appendChild(labelSwitch);
        list.appendChild(li);
    });
}

// --- ЛОГИКА ИГРЫ ---
function startGameSetup() {
    if (activeLocations.length === 0) {
        alert("Выберите локации в настройках!");
        return;
    }
    const totalPlayers = parseInt(document.getElementById('players-range').value);
    const spyCount = parseInt(document.getElementById('spy-range').value);
    const minutes = parseInt(document.getElementById('time-range').value);
    currentLocation = activeLocations[Math.floor(Math.random() * activeLocations.length)];
    players = Array(totalPlayers).fill(null).map(() => ({ role: "Мирный житель", location: currentLocation, isSpy: false }));
    
    let spiesAdded = 0;
    while (spiesAdded < spyCount) {
        const idx = Math.floor(Math.random() * totalPlayers);
        if (!players[idx].isSpy) {
            players[idx] = { role: "Шпион", location: "Неизвестно", isSpy: true };
            spiesAdded++;
        }
    }
    currentPlayerIndex = 0;
    totalTimeSec = minutes * 60;
    showCardScreen();
}

function showCardScreen() {
    showScreen('card');
    document.getElementById('player-number').innerText = currentPlayerIndex + 1;
    const card = document.getElementById('game-card');
    card.classList.remove('flipped');
    card.classList.remove('is-spy');
    document.getElementById('next-player-btn').classList.add('hidden');
    const player = players[currentPlayerIndex];
    setTimeout(() => {
        document.getElementById('role-text').innerText = player.role;
        document.getElementById('location-text').innerText = player.isSpy ? "Угадайте локацию" : player.location;
        if (player.isSpy) card.classList.add('is-spy');
    }, 300);
}

function flipCard() {
    const card = document.getElementById('game-card');
    if (card.classList.contains('flipped')) return;
    card.classList.add('flipped');
    document.getElementById('next-player-btn').classList.remove('hidden');
}

function nextPlayer() {
    currentPlayerIndex++;
    if (currentPlayerIndex < players.length) {
        showCardScreen();
    } else {
        startMainGame();
    }
}

function startMainGame() {
    showScreen('game');
    const list = document.getElementById('ingame-locations-list');
    list.innerHTML = '';
    [...activeLocations].sort().forEach(loc => {
        const li = document.createElement('li');
        li.innerHTML = `<div class="check-circle"></div> <span>${loc}</span>`;
        li.onclick = function() { this.classList.toggle('done'); };
        list.appendChild(li);
    });
    startTimer();
}

function startTimer() {
    const display = document.getElementById('timer-display');
    const circle = document.querySelector('.progress-ring__circle');
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = 0;
    let timeLeft = totalTimeSec;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const s = (timeLeft % 60).toString().padStart(2, '0');
        display.innerText = `${m}:${s}`;
        const offset = circumference - (timeLeft / totalTimeSec) * circumference;
        circle.style.strokeDashoffset = -offset;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            display.style.color = "#ff6b6b";
            setTimeout(finishGame, 1500);
        }
    }, 1000);
}

function finishGame() {
    clearInterval(timerInterval);
    showScreen('results');
    document.getElementById('result-location').innerText = currentLocation;
    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = '';
    players.forEach((p, index) => {
        const li = document.createElement('li');
        li.className = 'result-item';
        const iconClass = p.isSpy ? 'ph-sunglasses' : 'ph-user';
        const nameDiv = document.createElement('div');
        nameDiv.className = 'res-player';
        nameDiv.innerHTML = `<i class="ph-bold ${iconClass}"></i> Игрок ${index + 1}`;
        const roleDiv = document.createElement('div');
        roleDiv.innerText = p.isSpy ? 'Шпион' : 'Мирный';
        roleDiv.className = `res-role ${p.isSpy ? 'role-spy' : 'role-civil'}`;
        li.appendChild(nameDiv);
        li.appendChild(roleDiv);
        resultsList.appendChild(li);
    });
}

function toggleLocationsList() {
    const sheet = document.getElementById('locations-sheet');
    document.getElementById('modal-backdrop').classList.toggle('open');
    sheet.classList.toggle('open');
}
function toggleRules() {
    const sheet = document.getElementById('rules-sheet');
    document.getElementById('modal-backdrop').classList.toggle('open');
    sheet.classList.toggle('open');
}
function closeAllSheets() {
    document.getElementById('locations-sheet').classList.remove('open');
    document.getElementById('rules-sheet').classList.remove('open');
    document.getElementById('modal-backdrop').classList.remove('open');
}
function restartGame() {
    clearInterval(timerInterval);
    document.getElementById('timer-display').innerText = "00:00";
    document.getElementById('timer-display').style.color = "var(--text-main)";
    showScreen('setup');
}

renderSettingsList();

// --- PWA ЛОГИКА ---
let deferredPrompt;
const pwaBanner = document.getElementById('pwa-banner');
const iosInstructions = document.getElementById('install-instructions');
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

if (!isStandalone && !localStorage.getItem('pwaClosed')) {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showBanner();
    });
    if (isIOS) {
        iosInstructions.innerText = "Нажмите 'Поделиться' -> 'На экран Домой'";
        setTimeout(showBanner, 3000);
    }
}

function showBanner() { pwaBanner.classList.add('visible'); }
function closePWA() { pwaBanner.classList.remove('visible'); localStorage.setItem('pwaClosed', 'true'); }
function installPWA() {
    if (isIOS) {
        alert("На iPhone нажмите кнопку 'Поделиться' внизу браузера (квадрат со стрелкой), и выберите 'На экран Домой'.");
        closePWA();
    } else if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            deferredPrompt = null;
            closePWA();
        });
    }
}
