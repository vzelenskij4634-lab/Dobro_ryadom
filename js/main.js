
// ======================================
// КНОПКА ПРОКРУТКИ НАВЕРХ
// ======================================

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", function () {
    if (!backToTop) return;

    if (window.scrollY > 300) {
        backToTop.style.display = "flex";
        backToTop.style.alignItems = "center";
        backToTop.style.justifyContent = "center";
    } else {
        backToTop.style.display = "none";
    }
});

if (backToTop) {
    backToTop.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


// ======================================
// СИСТЕМА УВЕДОМЛЕНИЙ
// ======================================

const NOTIFICATIONS_KEY = "dobroRiadomNotifications";
const REGISTRATIONS_STORAGE_KEY = "dobroRiadomRegistrations";


// Получение уведомлений
function getNotifications() {
    try {
        const notifications = JSON.parse(
            localStorage.getItem(NOTIFICATIONS_KEY)
        );

        return Array.isArray(notifications) ? notifications : [];
    } catch {
        return [];
    }
}


// Сохранение уведомлений
function saveNotifications(notifications) {
    localStorage.setItem(
        NOTIFICATIONS_KEY,
        JSON.stringify(notifications)
    );

    updateNotificationsCount();
}


// Создание уведомления
function createNotification(data) {
    const notifications = getNotifications();

    // Не создаём повторное уведомление одного типа
    // для одной и той же записи
    if (
        data.registrationId &&
        notifications.some(notification =>
            notification.type === data.type &&
            notification.registrationId === data.registrationId
        )
    ) {
        return;
    }

    const notification = {
        id: Date.now() + Math.random(),
        type: data.type || "info",
        title: data.title || "Новое уведомление",
        message: data.message || "",
        eventId: data.eventId || null,
        registrationId: data.registrationId || null,
        createdAt: new Date().toISOString(),
        read: false
    };

    notifications.unshift(notification);

    saveNotifications(notifications);
}


// Количество непрочитанных уведомлений
function updateNotificationsCount() {
    const countElement = document.getElementById("notificationsCount");

    if (!countElement) return;

    const unreadCount = getNotifications().filter(
        notification => !notification.read
    ).length;

    countElement.textContent = unreadCount > 99
        ? "99+"
        : unreadCount;

    countElement.hidden = unreadCount === 0;
}


// Отметить уведомление прочитанным
function markNotificationAsRead(notificationId) {
    const notifications = getNotifications();

    const updatedNotifications = notifications.map(notification => {
        if (String(notification.id) === String(notificationId)) {
            return {
                ...notification,
                read: true
            };
        }

        return notification;
    });

    saveNotifications(updatedNotifications);
}


// Отметить все уведомления прочитанными
function markAllNotificationsAsRead() {
    const notifications = getNotifications().map(notification => ({
        ...notification,
        read: true
    }));

    saveNotifications(notifications);
}


// Удалить уведомление
function deleteNotification(notificationId) {
    const notifications = getNotifications().filter(
        notification =>
            String(notification.id) !== String(notificationId)
    );

    saveNotifications(notifications);
}


// ======================================
// НАПОМИНАНИЯ О МЕРОПРИЯТИЯХ
// ======================================

const reminderEvents = [
    { id: 1, title: "Чистый берег", date: "2026-11-20", time: "10:00" },
    { id: 2, title: "Тёплые сердца", date: "2026-11-25", time: "12:00" },
    { id: 3, title: "Учимся вместе", date: "2026-12-01", time: "15:00" },
    { id: 4, title: "Фестиваль искусств", date: "2026-12-05", time: "11:00" },
    { id: 5, title: "Зелёный город", date: "2026-12-10", time: "09:30" },
    { id: 6, title: "Поддержка каждому", date: "2026-12-15", time: "13:00" },
    { id: 7, title: "Помогаем животным", date: "2026-12-20", time: "10:00" },
    { id: 8, title: "Новогоднее чудо", date: "2026-12-25", time: "14:00" }
];


function checkEventReminders() {
    let registrations = [];

    try {
        registrations = JSON.parse(
            localStorage.getItem(REGISTRATIONS_STORAGE_KEY)
        ) || [];
    } catch {
        registrations = [];
    }

    if (!Array.isArray(registrations)) return;

    const now = new Date();

    registrations.forEach(registration => {
        const event = reminderEvents.find(
            item => item.id === Number(registration.eventId)
        );

        if (!event) return;

        const eventDateTime = new Date(
            `${event.date}T${event.time}:00`
        );

        const hoursUntilEvent =
            (eventDateTime - now) / (1000 * 60 * 60);

        // Напоминание за 24 часа или меньше,
        // но только до начала мероприятия
        if (hoursUntilEvent > 0 && hoursUntilEvent <= 24) {
            createNotification({
                type: "reminder",
                title: "Скоро мероприятие!",
                message: `Уже скоро состоится мероприятие «${event.title}». Начало: ${event.time}. Не забудьте подготовиться!`,
                eventId: event.id,
                registrationId: registration.id
            });
        }
    });
}


// ======================================
// НАВИГАЦИЯ: МЕРОПРИЯТИЯ И УВЕДОМЛЕНИЯ
// ======================================

document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector(".navbar-nav");

    if (!navbar) {
        updateNotificationsCount();
        return;
    }

    const currentPage = window.location.pathname
        .split("/")
        .pop();

    // ----------------------------------
    // Пункт «Мероприятия»
    // ----------------------------------

    if (!navbar.querySelector('[data-nav="events"]')) {
        const eventsItem = document.createElement("li");
        eventsItem.className = "nav-item";

        const eventsLink = document.createElement("a");
        eventsLink.className = "nav-link";
        eventsLink.href = "events.html";
        eventsLink.textContent = "Мероприятия";
        eventsLink.dataset.nav = "events";

        if (
            currentPage === "events.html" ||
            currentPage === "my-events.html"
        ) {
            eventsLink.classList.add("active");
            eventsLink.setAttribute("aria-current", "page");
        }

        eventsItem.appendChild(eventsLink);

        const contactsLink = Array.from(
            navbar.querySelectorAll(".nav-link")
        ).find(link => link.textContent.trim() === "Контакты");

        if (contactsLink) {
            navbar.insertBefore(
                eventsItem,
                contactsLink.closest(".nav-item")
            );
        } else {
            navbar.appendChild(eventsItem);
        }
    }


    // ----------------------------------
    // Колокольчик уведомлений
    // ----------------------------------

    if (!navbar.querySelector('[data-nav="notifications"]')) {
        const notificationItem = document.createElement("li");
        notificationItem.className = "nav-item";

        const notificationLink = document.createElement("a");
        notificationLink.className = "nav-link notifications-nav-link";
        notificationLink.href = "notifications.html";
        notificationLink.dataset.nav = "notifications";
        notificationLink.setAttribute(
            "aria-label",
            "Уведомления"
        );
        notificationLink.title = "Уведомления";

        notificationLink.innerHTML = `
            <span class="notifications-bell">
                <i class="bi bi-bell"></i>
                <span
                    class="notifications-count"
                    id="notificationsCount"
                    hidden
                >0</span>
            </span>
        `;

        if (currentPage === "notifications.html") {
            notificationLink.classList.add("active");
            notificationLink.setAttribute("aria-current", "page");
        }

        notificationItem.appendChild(notificationLink);

        // Колокольчик ставим после «Контакты»
notificationItem.appendChild(notificationLink);
navbar.appendChild(notificationItem);
    }

    updateNotificationsCount();
});


// ======================================
// СИНХРОНИЗАЦИЯ МЕЖДУ ВКЛАДКАМИ
// ======================================

window.addEventListener("storage", function (event) {
    if (event.key === NOTIFICATIONS_KEY) {
        updateNotificationsCount();
    }
});


// ======================================
// ПЕРВОНАЧАЛЬНАЯ ПРОВЕРКА
// ======================================

checkEventReminders();
updateNotificationsCount();
