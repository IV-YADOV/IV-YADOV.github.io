const tg = window.Telegram.WebApp;
tg.expand();

// Цвета
tg.MainButton.textColor = '#000000';
tg.MainButton.color = '#ffffff';

// Анимация Сакуры
function createSakura() {
    const container = document.getElementById('sakuraContainer');
    // Проверка на случай, если контейнера нет (чтобы скрипт не падал)
    if (!container) return; 

    const petalCount = 12; 
    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        const size = Math.random() * 8 + 4 + 'px';
        const left = Math.random() * 100 + 'vw';
        const delay = Math.random() * 5 + 's';
        const duration = Math.random() * 5 + 6 + 's';
        petal.style.width = size; petal.style.height = size;
        petal.style.left = left;
        petal.style.animationDelay = delay; petal.style.animationDuration = duration;
        container.appendChild(petal);
    }
}
document.addEventListener('DOMContentLoaded', createSakura);

// --- ЛОГИКА ТАБОВ ---
function switchTab(tabId) {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        if (page.id === tabId) {
            page.classList.remove('fadeIn');
            void page.offsetWidth; 
            page.classList.add('active');
            page.classList.add('fadeIn');
        }
    });

    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    const indexMap = { 'overview': 0, 'format': 1, 'register': 2 };
    if (indexMap[tabId] !== undefined) {
        document.querySelectorAll('.nav-item')[indexMap[tabId]].classList.add('active');
    }
}

// --- ЕДИНАЯ ФУНКЦИЯ ОТПРАВКИ (С ОТЛАДКОЙ) ---
function submitForm() {
    try {
        // 1. Сбор данных
        const teamNameEl = document.getElementById('teamName');
        const logoLinkEl = document.getElementById('logoLink');
        const contactEl = document.getElementById('contact');
        
        // Игроки
        const p1El = document.getElementById('player1');
        const p2El = document.getElementById('player2');
        const p3El = document.getElementById('player3');
        const p4El = document.getElementById('player4');
        const p5El = document.getElementById('player5');
        const pSubEl = document.getElementById('playerSub');

        // Чекбокс
        const mediaAgreementEl = document.getElementById('mediaAgreement');

        // ПРОВЕРКА: Если какого-то элемента нет в HTML, сообщаем об этом
        if (!teamNameEl || !p1El || !mediaAgreementEl) {
            alert("Ошибка кода: Не найдены поля ввода (ID не совпадают). Обновите HTML.");
            return;
        }

        const teamName = teamNameEl.value.trim();
        const logoLink = logoLinkEl.value.trim();
        const contact = contactEl.value.trim();
        const p1 = p1El.value.trim();
        const p2 = p2El.value.trim();
        const p3 = p3El.value.trim();
        const p4 = p4El.value.trim();
        const p5 = p5El.value.trim();
        const pSub = pSubEl ? pSubEl.value.trim() : "";
        const mediaAgreed = mediaAgreementEl.checked;

        // 2. Валидация
        if (!mediaAgreed) {
            tg.showPopup({
                title: 'Внимание',
                message: 'Поставьте галочку согласия с медиа-активностью.',
                buttons: [{type: 'ok'}]
            });
            return;
        }

        if (!teamName || !logoLink || !contact || !p1 || !p2 || !p3 || !p4 || !p5) {
            tg.showPopup({
                title: 'Заполните поля',
                message: 'Нужно название, лого, контакт и 5 игроков.',
                buttons: [{type: 'ok'}]
            });
            return;
        }

        // 3. Формирование данных
        const roster = `1. ${p1}\n2. ${p2}\n3. ${p3}\n4. ${p4}\n5. ${p5}\nЗапас: ${pSub || 'Нет'}`;

        const data = {
            team: teamName,
            logo: logoLink,
            contact: contact,
            roster: roster,
            media_agreed: true,
            action: 'registration'
        };

        // 4. Отправка
        tg.sendData(JSON.stringify(data));
        
        // На случай тестирования в браузере (где sendData не работает)
        if (!window.Telegram.WebApp.initData) {
            alert("Данные сформированы! (В браузере отправка не работает, откройте в Telegram)");
            console.log(data);
        }

    } catch (error) {
        alert("Произошла ошибка: " + error.message);
    }
}