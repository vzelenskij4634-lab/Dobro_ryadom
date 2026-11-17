
// ======================================
// СТРАНИЦА УВЕДОМЛЕНИЙ
// ======================================

const NOTIFICATIONS_PAGE_KEY = "dobroRiadomNotifications";

const notificationsContainer = document.getElementById(
    "notificationsContainer"
);

const notificationsEmpty = document.getElementById(
    "notificationsEmpty"
);

const notificationsPageCount = document.getElementById(
    "notificationsPageCount"
);

const markAllReadButton = document.getElementById("markAllRead");


// ======================================
// LOCALSTORAGE
// ======================================

function getNotifications() {
    try {
        const data = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY));
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function saveNotifications(notifications) {
    localStorage.setItem(
        NOTIFICATIONS_KEY,
        JSON.stringify(notifications)
    );

    updateNotificationsCount();
}


// ======================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ======================================

function escapeNotificationHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];
    });
}


function formatNotificationDate(dateString) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}


function getNotificationIcon(type) {
    const icons = {
        registration: "bi-calendar-check",
        cancellation: "bi-calendar-x",
        reminder: "bi-alarm",
        info: "bi-info-circle"
    };

    return icons[type] || icons.info;
}


function getNotificationLabel(type) {
    const labels = {
        registration: "Запись на мероприятие",
        cancellation: "Отмена записи",
        reminder: "Напоминание",
        info: "Информация"
    };

    return labels[type] || labels.info;
}


// ======================================
// СЧЁТЧИК
// ======================================

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


// ======================================
// ОТМЕТКА ПРОЧИТАННЫМ
// ======================================

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
    renderNotifications();
}


// ======================================
// УДАЛЕНИЕ
// ======================================

function removeNotification(notificationId) {
    const updatedNotifications = getNotifications().filter(
        notification =>
            String(notification.id) !== String(notificationId)
    );

    saveNotifications(updatedNotifications);
    renderNotifications();
}


// ======================================
// ОТРИСОВКА УВЕДОМЛЕНИЙ
// ======================================

function renderNotifications() {
    if (!notificationsContainer) return;

    const notifications = getNotifications();

    const unreadCount = notifications.filter(
        notification => !notification.read
    ).length;

    notificationsPageCount.textContent = notifications.length === 0
        ? "Пока нет уведомлений"
        : `Всего уведомлений: ${notifications.length} · Непрочитанных: ${unreadCount}`;

    notificationsEmpty.hidden = notifications.length !== 0;
    markAllReadButton.disabled = unreadCount === 0;

    notificationsContainer.innerHTML = "";

    notifications.forEach(notification => {
        const card = document.createElement("article");

        card.className = `notification-card ${
            notification.read ? "notification-card--read" : "notification-card--unread"
        }`;

        card.innerHTML = `
            <div class="notification-card__icon">
                <i class="bi ${getNotificationIcon(notification.type)}"></i>
            </div>

            <div class="notification-card__content">
                <div class="notification-card__top">
                    <span class="notification-card__type">
                        ${getNotificationLabel(notification.type)}
                    </span>

                    ${notification.read
                        ? ""
                        : '<span class="notification-card__new">Новое</span>'
                    }
                </div>

                <h3>${escapeNotificationHTML(notification.title)}</h3>

                <p>${escapeNotificationHTML(notification.message)}</p>

                <span class="notification-card__date">
                    <i class="bi bi-clock"></i>
                    ${formatNotificationDate(notification.createdAt)}
                </span>

                <div class="notification-card__actions">
                    ${
                        notification.read
                            ? ""
                            : `<button
                                type="button"
                                class="notification-read"
                                data-id="${escapeNotificationHTML(notification.id)}">
                                <i class="bi bi-check2"></i>
                                Прочитано
                               </button>`
                    }

                    <button
                        type="button"
                        class="notification-delete"
                        data-id="${escapeNotificationHTML(notification.id)}">
                        <i class="bi bi-trash3"></i>
                        Удалить
                    </button>
                </div>
            </div>
        `;

        notificationsContainer.appendChild(card);
    });

    updateNotificationsCount();
}


// ======================================
// ОБРАБОТКА КНОПОК
// ======================================

notificationsContainer.addEventListener("click", function (event) {
    const readButton = event.target.closest(".notification-read");
    const deleteButton = event.target.closest(".notification-delete");

    if (readButton) {
        markNotificationAsRead(readButton.dataset.id);
    }

    if (deleteButton) {
        removeNotification(deleteButton.dataset.id);
    }
});


// ======================================
// ПРОЧИТАТЬ ВСЁ
// ======================================

markAllReadButton.addEventListener("click", function () {
    const notifications = getNotifications().map(notification => ({
        ...notification,
        read: true
    }));

    saveNotifications(notifications);
    renderNotifications();
});


// ======================================
// СИНХРОНИЗАЦИЯ
// ======================================

window.addEventListener("storage", function (event) {
    if (event.key === NOTIFICATIONS_KEY) {
        renderNotifications();
    }
});


// ======================================
// ПЕРВОНАЧАЛЬНЫЙ ЗАПУСК
// ======================================

renderNotifications();
