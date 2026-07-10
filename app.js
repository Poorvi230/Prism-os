let timerInterval = null;
let timeRemaining = 25 * 60;
let isTimerRunning = false;

setTimeout(() => {
const bootScreen = document.getElementById('boot-screen');
if (bootScreen) {
    bootScreen.classList.add('boot-hidden');
    setTimeout(() => bootScreen.remove(), 500);
}
}, 2500);

function updateClock() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const formattedTime = `${year}.${month}.${day} │ ${hours}:${minutes}:${seconds}   `;
    document.getElementById('system-time').textContent = formattedTime;
}

setInterval(updateClock, 1000);
updateClock();

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === 'click') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    } else if (type === 'success') {

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.setValueAtTime(600, audioCtx.currentTime + 0.1);

         gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
         gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.3)
    }
}

document.addEventListener('click', (e) => {
    if (e.target.closest('button')) {
        playSound('click');
    }
});

function openApp(appId) {
    const windowEl = document.getElementById('app-window');
    const titleEl = document.getElementById('app-title');
    const bodyEl = document.getElementById('app-body');

    windowEl.classList.remove('hidden');

    if (appId === 'data-log') {
        titleEl.textContent = 'MODULE 01 // DATA LOG';
        
        bodyEl.innerHTML = `
            <div class="log-form">
                <input type="text" id="new-log-input" class="log-input" placeholder="RECORD OBSERVATION..." autocomplete="off">
                <button class="log-submit-btn" onclick="saveNewLog()">[ COMMIT TO REPOSITORY ]</button>
            </div>
            <div class="deco-line-thin"></div>
            <ul id="saved-logs" class="log-list"></ul>
        `;
        displayLogs();

    } else if (appId === 'chrono') {
        titleEl.textContent = 'MODULE 02 // CHRONO ENGINE';
        bodyEl.innerHTML = `
            <div class="pop-chrono-box">
                <p style="color: var(--pop-yellow); font-weight: 900; font-size: 0.9rem; letter-spacing: 2px;">
                    [ POMODORO CORE FOCUS ]
                </p>
                <div id="timer-render" class="pop-chrono-display">${formatTimerDisplay()}</div>
                <div class="pop-chrono-controls">
                    <button class="pop-btn" onclick="toggleTimer()">START / PAUSE</button>
                    <button class="pop-btn" onclick="resetTimer()" style="background-color: var(--bg-cream);">RESET</button>
                </div>
            </div>
        `; 

    } else if (appId === 'parameters') {
        titleEl.textContent = 'MODULE 03 // PARAMETERS';

        const currentTheme = document.body.classList.contains('cyberpunk') ? 'SWISS DAY' : 'CYBERPUNK NIGHT';

        bodyEl.innerHTML = `
        <p style="color: var(--slate); font-size: 0.85rem; margin-bottom: 15px;">[ SYSTEM MATRIX INTERFACE DESIGN OVERRIDES ]</p>
        <div class="param-toggle-box">
            <div>
                <strong style="display:block;">CHROMATIC PROFILE</strong>
                <span style="font-size:0.8rem; color: var(--slate);">Toggle between Swiss minimal canvas and dark terminal architecture.</span>
            </div>
            <button id="theme-toggle-btn" class="param-btn" onclick="toggleSystemTheme()">[ SWITCH TO ${currentTheme} ]</button>
        </div>
        `;
    } else if (appId === 'mood-board') {
            titleEl.textContent = 'MODULE 04 // MOOD BOARD';
            bodyEl.innerHTML = `
                <div class="theme-selectors">
                    <label class="theme-label"><input type="checkbox" id="theme-geo" checked> [ GEOMETRIC ]</label>
                    <label class="theme-label"><input type="checkbox" id="theme-neon"> [ NEON ]</label>
                    <label class="theme-label"><input type="checkbox" id="theme-swiss"> [ SWISS ]</label>
                </div>
                <div id="art-canvas" class="art-canvas"></div>
                <button class="art-btn" onclick="generateArt()">[ GENERATE ALGORITHM ]</button>
                <button class="art-btn" onclick="setWallpaper()"
                style="background-color: var(--mustard);">[ SET WALLPAPER ]</button>
                </div>
            `;
} else if (appId === 'gallery') {
    titleEl.textContent = 'MODULE 05 // GALLERY ARCHIVES';
        bodyEl.innerHTML = `
            <p style="color: var(--slate); font-size: 0.85rem; margin-bottom: 10px;">[ LOCAL STORAGE DIRECTORY ]</p>
            <div class="gallery-grid">
                <div class="gallery-folder folder-pink" onclick="playSound('click'); alert('FILE CORRUPTED.')">
                    <p>[ IMG_001 ]</p>
                </div>
                <div class="gallery-folder folder-yellow" onclick="playSound('click'); alert('ACCESS DENIED.')">
                    <p>[ SYS_CORE ]</p>
                </div>
                <div class="gallery-folder folder-teal" onclick="playSound('click'); alert('NO DATA FOUND.')">
                    <p>[ ARCHIVE_A ]</p>
                </div>
                <div class="gallery-folder folder-dark" onclick="playSound('success'); alert('WELCOME, ADMIN.')">
                    <p>[ ROOT_KEY ]</p>
                </div>
            </div>
        `;
} else if (appId === 'arcade') {
    titleEl.textContent = 'MODULE 06 // ARCADE SIMULATION';
    bodyEl.innerHTML = ` 
    <p style="color: var(--slate); font-size: 0.85rem; margin-bottom: 10px;">[ PRESS SPACEBAR OR CLICK JUMP TO EVADE ]</p>
            <div id="game-board">
                <div id="dino"></div>
                <div id="cactus"></div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span id="dino-score" style="font-size: 1.5rem; font-weight: 900; color: var(--sage);">SCORE: 000</span>
                <div style="display: flex; gap: 10px;">
                    <button class="pop-btn" onclick="startDinoGame()">START</button>
                    <button id="jump-btn" class="pop-btn" onclick="jumpDino()" style="background-color: var(--pop-pink);">JUMP</button>
                </div>
            </div>
                    `;
     }
}

function closeApp() {
    document.getElementById('app-window').classList.add('hidden');
    
    // gotta stop the arcade loop or you just keep dying in the background lol
    if (typeof gameInterval !== 'undefined') {
        clearInterval(gameInterval);
        document.removeEventListener('keydown', handleJump);
    }
}

// treats minimize same as close for now
function minimizeApp() {
    document.getElementById('app-window').classList.add('hidden');
}

function saveNewLog() {
    const inputEl = document.getElementById('new-log-input');
    const text = inputEl.value.trim();

    if (text === '') return;
    let logs = JSON.parse(localStorage.getItem('prism_logs')) || [];

    const timestamp = new Date();
    const dateStr = `${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}`;

    const newEntry = {
        text: text,
        time: dateStr
    };

    logs.push(newEntry);
    localStorage.setItem('prism_logs', JSON.stringify(logs));

    inputEl.value = '';
    displayLogs();
}

function displayLogs() {
    const listEl = document.getElementById('saved-logs');
    let logs = JSON.parse(localStorage.getItem('prism_logs')) || [];

    if (logs.length === 0) {
        listEl.innerHTML = `<li style="color: var(--slate); font-style: italic;">REPOSITORY IS EMPTY // NO DATA FOUND</li>`;
        return;
    }

    listEl.innerHTML = logs.map((log, index) => {
        const paddedIndex = String(index + 1).padStart(3, '0');
        return `
          <li class="log-list-item">
          <span class="log-index">${paddedIndex}</span>
          <span class="log-text">${log.text}</span>
          <span class="log-date">${log.time}</span>
          </li>
          `;
    }).join('');
}

function toggleTimer() {
    if (isTimerRunning) {
        clearInterval(timerInterval);
        isTimerRunning = false;
    } else {
        isTimerRunning = true;
        timerInterval = setInterval(() => {
            const displayEl = document.getElementById('timer-render');
            if(displayEl) {
                if(timeRemaining > 0) {
                    timeRemaining--;
                    displayEl.textContent = formatTimerDisplay();
                } else {
                    clearInterval(timerInterval);
                    isTimerRunning = false;
                    alert("Interval concluded. Initiate resting protocol.");
                    resetTimer();
                }
            } else {
                if (timeRemaining > 0) {
                    timeRemaining--;
                } else {
                    clearInterval(timerInterval);
                    isTimerRunning = false;
                }
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timeRemaining = 25 * 60;
    const displayEl = document.getElementById('timer-render');
    if (displayEl) displayEl.textContent = formatTimerDisplay();
}

function formatTimerDisplay(){
    const minutes = String(Math.floor(timeRemaining / 60)).padStart(2, '0');
    const seconds = String(timeRemaining % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
}

function toggleSystemTheme() {
    const body = document.body;
    const btn = document.getElementById('theme-toggle-btn');
    
    body.classList.toggle('cyberpunk');
    
    if (body.classList.contains('cyberpunk')) {
        btn.textContent = '[ SWITCH TO SWISS DAY ]';
    } else {
        btn.textContent = '[ SWITCH TO CYBERPUNK NIGHT ]';
    }
}

const appWindow = document.getElementById('app-window');
const appHeader = document.querySelector('.app-header');

let isDragging = false;
let offsetX, offsetY;

appHeader.addEventListener('mousedown', (e) => {
    // block drag if clicking the window controls
    if (e.target.closest('.close-btn')) return;

    isDragging = true;
    offsetX = e.clientX - appWindow.getBoundingClientRect().left;
    offsetY = e.clientY - appWindow.getBoundingClientRect().top;
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    let newX = e.clientX - offsetX;
    let newY = e.clientY - offsetY;

appWindow.style.left = `${newX}px`;
appWindow.style.top = `${newY}px`;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

function generateArt() {
    const canvas = document.getElementById('art-canvas');
    canvas.innerHTML = '';

    const useGeo = document.getElementById('theme-geo').checked;
    const useNeon = document.getElementById('theme-neon').checked;
    const useSwiss = document.getElementById('theme-swiss').checked;

    let colors = ['#2b2b2b', '#ebe1bf'];
        if (useNeon) colors.push('#ff007f', '#00ffcc', '#fce260', '#ff007f', '#00ffcc', '#fce260');
        if (useSwiss) colors.push('#cc6655', '#e59933', '#44c063', '#cc6655', '#e59933', '#44c063');

    const shapes = ['0%', '50%', '100px'];
    const shapeCount = Math.floor(Math.random() * 40) + 60;

    for (let i = 0; i < shapeCount; i++) {
        const shape = document.createElement('div');
        shape.classList.add('art-shape');

          const sizeMultiplier = Math.floor(Math.random() * 4) + 1;
            const width = sizeMultiplier * 40;
            const height = (Math.random() > 0.5 ? sizeMultiplier : Math.floor(Math.random() * 4) + 1) * 40;

            const maxRows = Math.floor(window.innerHeight / 40) + 2;
            const maxCols = Math.floor(700 / 40) + 2;

            const top = (Math.floor(Math.random() * maxRows) - 1) * 40;
            const left = (Math.floor(Math.random() * maxCols) - 1) * 40;

            const color = colors[Math.floor(Math.random() * colors.length)];
            const borderRadius = useGeo ? shapes[Math.floor(Math.random() * shapes.length)] : '0%';

        shape.style.width = `${width}px`;
        shape.style.height = `${height}px`;
        shape.style.top = `${top}px`;
        shape.style.left = `${left}px`;
        shape.style.backgroundColor = color;
        shape.style.borderRadius = borderRadius;
        shape.style.zIndex = i;

        shape.style.opacity = '0.85';

        canvas.appendChild(shape);
    }
}

function setWallpaper() {
    const canvas = document.getElementById('art-canvas');
    const wallpaperLayer = document.getElementById('os-wallpaper');

    wallpaperLayer.innerHTML = canvas.innerHTML;
    playSound('success');
    alert("SYSTEM: Background updated successfully.");
}

let gameInterval;
let gameScore = 0;

function startDinoGame() {
    const dino = document.getElementById('dino');
    const cactus = document.getElementById('cactus');
    const scoreDisplay = document.getElementById('dino-score');

    if (!dino || !cactus) return;

    cactus.style.animationPlayState = 'running';
    cactus.className = '';
    void cactus.offsetWidth;
    cactus.className = 'obstacle-single cactus-move';

    cactus.onanimationiteration = () => {
        const rand = Math.random();
        if (rand < 0.2) cactus.className = 'obstacle-single cactus-move';
        else if (rand < 0.4) cactus.className = 'obstacle-double cactus-move';
        else if (rand < 0.6) cactus.className = 'obstacle-triple cactus-move';
        else if (rand < 0.8) cactus.className = 'obstacle-bird-low cactus-move';
        else cactus.className = 'obstacle-bird-high cactus-move';
    };

    gameScore = 0;
    document.addEventListener('keydown', handleJump);

    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        let dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue('top'));
        let obsLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue('left'));
        let obsTop = parseInt(window.getComputedStyle(cactus).getPropertyValue('top'));
        let obsWidth = cactus.offsetWidth;
        
        if (obsLeft < 55 && obsLeft + obsWidth > 25 && dinoTop < obsTop + 35 && dinoTop + 35 > obsTop) {
            cactus.style.animationPlayState = 'paused';
            clearInterval(gameInterval);
            document.removeEventListener('keydown', handleJump);
            playSound('click');
            alert("SYSTEM FAILURE. FINAL SCORE: " + Math.floor(gameScore / 10));
        } else {
            gameScore++;
            if (scoreDisplay) scoreDisplay.textContent = "SCORE: " + String(Math.floor(gameScore / 10)).padStart(3, '0');
        }
    }, 10);
}   

function handleJump(e) {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jumpDino();
        const btn = document.getElementById('jump-btn');
        if (btn) {
            btn.style.transform = 'translate(2px, 2px)';
            btn.style.boxShadow = '2px 2px 0px var(--charcoal)';
            setTimeout(() => {
                btn.style.transform = '';
                btn.style.boxShadow = '';
            }, 150);
        }
    }
}

function jumpDino() {
    const dino = document.getElementById('dino');

    if (!dino.classList.contains('jump')) {
        dino.classList.add('jump');
        playSound('success');

        setTimeout(() => {
            dino.classList.remove('jump');
        }, 500);
    }
}



