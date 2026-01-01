const CACHE_NAME = 'spyfall-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    'https://unpkg.com/@phosphor-icons/web', // Иконки (кешируем CDN)
    'https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap' // Шрифты
];

// 1. Установка: Кешируем ресурсы
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// 2. Активация: Чистим старый кэш
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            );
        })
    );
});

// 3. Перехват запросов: Отдаем из кэша, если нет инета
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
