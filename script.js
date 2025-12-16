// Данные проектов (Архив дел)
const projectsData = [
    {
        id: 1,
        title: "LIRA COSMETOLOGY",
        date: "CASE #412",
        description: "Цифровое представительство клиники эстетической медицины. Клиническая чистота кода, адаптивная верстка и интеграция с онлайн-записью. Задача: вызвать доверие с первого пикселя.",
        stack: "HTML5 • CSS3 • JS • Yandex Maps",
        images: [
            "assets/lira-1.png", 
            "assets/lira-2.png", 
            "assets/lira-3.png"
        ],
        // Ссылка на живой сайт есть
        links: { live: "https://lira-khv.ru", code: "https://github.com/IV-YADOV/lira-landing" } 
    },
    {
        id: 2,
        title: "TRIANI CLINIC",
        date: "CASE #231",
        description: "Глянцевый фасад для лаборатории красоты. Строгая геометрия, адаптивный дизайн и фокус на визуальном контенте. Интерфейс, где эстетика возведена в абсолют.",
        stack: "HTML5 • CSS3 • JS • Adaptive Layout",
        images: [
            "assets/triani-1.png", 
            "assets/triani-2.png", 
            "assets/triani-3.png"
        ],
        // Ссылка на живой сайт есть
        links: { live: "https://триани.рф", code: "#" }
    },
    {
        id: 3,
        title: "IRONBUDDY",
        date: "CASE #15",
        description: "Мобильный инструмент для реконструкции физической формы. Создание программ тренировок, строгий учет прогресса и соревновательные рейтинги. Дисциплина, переведенная в код.",
        stack: "Android • Flutter • Firebase",
        images: [
            // Сохраните скриншоты из RuStore в папку assets
            "assets/iron-1.png",
            "assets/iron-2.png",
            "assets/iron-3.png"
        ],
        // Ссылка на RuStore
        links: { live: "https://www.rustore.ru/catalog/app/com.example.gym_app", code: "#" }
    },
    
];

// Генерация ПАПОК
const projectsContainer = document.getElementById('projectsContainer');

// Очищаем контейнер перед генерацией
projectsContainer.innerHTML = '';

projectsData.forEach((project, index) => {
    const folder = document.createElement('div');
    folder.classList.add('folder');
    // Каскадная анимация появления
    folder.style.animation = `fadeIn 0.6s ease forwards ${index * 0.2}s`;
    folder.style.opacity = '0'; 

    folder.innerHTML = `
        <div class="folder-paper">
            <strong>EVIDENCE LIST:</strong><br>
            Stack: ${project.stack}<br><br>
            Click folder to open<br>full dossier...
        </div>
        
        <div class="folder-tab-text">${project.date}</div>

        <div class="folder-cover" onclick="openModal(${project.id})">
            <div class="folder-content">
                <div class="stamp-box">TOP SECRET</div>
                <h3>${project.title}</h3>
                <p>${project.description.substring(0, 80)}...</p>
            </div>
            <div style="text-align: right; margin-top: 15px;">
                <span style="font-size: 1.5rem; color: #555;">&rarr;</span>
            </div>
        </div>
    `;
    projectsContainer.appendChild(folder);
});

// Элементы модального окна
const modal = document.getElementById('projectModal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalStack = document.getElementById('modalStack');

// Кнопки ссылок
const modalLive = document.getElementById('modalLive'); 
const modalCode = document.getElementById('modalCode');

// Фотографии
const photo1 = document.getElementById('photo1');
const photo2 = document.getElementById('photo2');
const photo3 = document.getElementById('photo3');

// --- ФУНКЦИЯ ПРОВЕРКИ И ОБНОВЛЕНИЯ КНОПОК ---
function updateButtonState(button, url) {
    // Если ссылки нет, или она равна #, или пустая
    if (!url || url === "#") {
        button.removeAttribute('href'); 
        button.classList.add('disabled'); 
        button.target = "";
    } else {
        button.href = url;
        button.classList.remove('disabled'); 
        button.target = "_blank"; 
    }
}

function openModal(id) {
    const project = projectsData.find(p => p.id === id);
    if (!project) return;

    modalTitle.innerText = project.title;
    modalDesc.innerText = project.description;
    modalStack.innerText = project.stack;
    
    // --- ЛОГИКА ДЛЯ КНОПОК ---
    updateButtonState(modalLive, project.links.live);
    updateButtonState(modalCode, project.links.code);
    
    // Установка картинок на доску
    if (project.images && project.images.length > 0) {
        photo1.style.backgroundImage = `url('${project.images[0]}')`;
        photo2.style.backgroundImage = `url('${project.images[1] || project.images[0]}')`;
        photo3.style.backgroundImage = `url('${project.images[2] || project.images[0]}')`;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; 
}

closeModal.onclick = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
};

window.onclick = (e) => {
    if (e.target == modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
};

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Фонарик и Курсор
const spotlight = document.getElementById('spotlight');
const cursorDot = document.getElementById('cursorDot');
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.top = mouseY + 'px';
        cursorDot.style.left = mouseX + 'px';
        
        spotlight.style.setProperty('--x', mouseX + 'px');
        spotlight.style.setProperty('--y', mouseY + 'px');
    });

    document.querySelectorAll('a, button, li, .folder-cover').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(2.5)';
            cursorDot.style.background = 'transparent';
            cursorDot.style.border = '1px solid var(--accent)';
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorDot.style.background = 'var(--accent)';
            cursorDot.style.border = 'none';
        });
    });
} else {
    cursorDot.style.display = 'none';
}

// Аудио
const soundBtn = document.getElementById('soundToggle');
const audio = document.getElementById('bgAudio');
let isPlaying = false;

soundBtn.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        soundBtn.innerText = "🔇 MUTE";
    } else {
        audio.volume = 0.3; 
        audio.play();
        soundBtn.innerText = "🔊 SOUND ON";
    }
    isPlaying = !isPlaying;
});