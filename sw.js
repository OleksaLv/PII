// Ім'я кешу, який використовуватиметься для збереження ресурсів
const CACHE_NAME = "pwa-cache-v1";

// Масив ресурсів, які будуть кешовані при встановленні Service Worker 
// ви кешуєте всі свої файли
const ASSETS = [
  "./",                      // Головна сторінка
  "./students.html",            // HTML-файл
  "./stylesheets/general.css",             // CSS-стилі
  "./stylesheets/elements/header.css",
  "./stylesheets/elements/navigation.css",
  "./stylesheets/pages/students.css",
  "./stylesheets/elements/notifications-popup.css",
  "./stylesheets/elements/profile-popup.css",
  "./stylesheets/elements/student-delete-modal.css",
  "./scripts/script.js",             // Головний JavaScript-файл
  "./data/students.json",         // JSON-файл з даними
  "./icons/icons.128.png",   // Іконка 128px
  "./icons/icons.192.png",   // Іконка 192px
  "./icons/icons.256.png",   // Іконка 256px
  "./icons/icons.512.png",   // Іконка 512px
  "./icons/bell.png",
  "./icons/profile.jpg",
];

// Подія встановлення Service Worker
// Відбувається при першому запуску або коли SW оновлюється
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Кешування ресурсів...");// логування не обовязкове
      // Додаємо файли до кешу, якщо якийсь файл не вдасться завантажити, обробляємо помилку
      return cache.addAll(ASSETS).catch(console.error);
    })
  );
});

// Подія обробки запитів від клієнта (браузера)
// Якщо файл є в кеші – повертаємо його, інакше робимо запит до мережі
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const networkFetch = fetch(event.request)
          .then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
          .catch(() => {
            // Fallback (optional offline page or just skip)
            return cachedResponse || caches.match("./students.html");
          });
        return cachedResponse || networkFetch;
      });
    })
  );
});

// Подія активації Service Worker
// Видаляє старі кеші, які більше не використовуються
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME) // Знаходимо старі кеші
          .map((key) => caches.delete(key))   // Видаляємо їх
      );
    }).then(() => {
      console.log("Новий Service Worker активовано.");
      return self.clients.claim(); // Переключаємо новий SW для всіх вкладок
    })
  );
});