const tg = window.Telegram.WebApp;
tg.expand();

// Настройка цветов
tg.MainButton.textColor = '#000000';
tg.MainButton.color = '#ffffff';

// Генерация Сакуры
function createSakura() {
    const container = document.getElementById('sakuraContainer');
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

    // Если мы на вкладке регистрации, показываем кнопку ТГ (как доп опцию)
    if (tabId === 'register') {
        tg.MainButton.setText("ОТПРАВИТЬ ЗАЯВКУ");
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

// --- ЕДИНАЯ ФУНКЦИЯ ОТПРАВКИ ---
function submitForm() {
    // Сбор данных
    const teamName = document.getElementById('teamName').value.trim();
    const logoLink = document.getElementById('logoLink').value.trim();
    const contact = document.getElementById('contact').value.trim();
    
    // Игроки
    const p1 = document.getElementById('player1').value.trim();
    const p2 = document.getElementById('player2').value.trim();
    const p3 = document.getElementById('player3').value.trim();
    const p4 = document.getElementById('player4').value.trim();
    const p5 = document.getElementById('player5').value.trim();
    const pSub = document.getElementById('playerSub').value.trim();

    // Чекбокс
    const mediaAgreed = document.getElementById('mediaAgreement').checked;

    // Валидация
    if (!mediaAgreed) {
        tg.hapticFeedback.notificationOccurred('error');
        tg.showPopup({
            title: 'Ошибка',
            message: 'Вы должны поставить галочку согласия с медиа-активностью.',
            buttons: [{type: 'ok'}]
        });
        return;
    }

    if (!teamName || !logoLink || !contact || !p1 || !p2 || !p3 || !p4 || !p5) {
        tg.hapticFeedback.notificationOccurred('error');
        tg.showPopup({
            title: 'Заполните данные',
            message: 'Нужно указать название, логотип, контакты и 5 игроков основы.',
            buttons: [{type: 'ok'}]
        });
        return;
    }

    // Формируем красивый список
    const roster = `1. ${p1}\n2. ${p2}\n3. ${p3}\n4. ${p4}\n5. ${p5}\nЗапас: ${pSub || 'Нет'}`;

    const data = {
        team: teamName,
        logo: logoLink,
        contact: contact,
        roster: roster,
        media_agreed: true,
        action: 'registration'
    };

    tg.hapticFeedback.notificationOccurred('success');
    
    // Отправляем данные боту
    tg.sendData(JSON.stringify(data));
    
    // На всякий случай закрываем (если открыто как попап)
    // tg.close();
}

// Обработка клика по синей кнопке Телеграма
Telegram.WebApp.onEvent('mainButtonClicked', submitForm);