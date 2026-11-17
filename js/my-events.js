
// ======================================
// МОИ МЕРОПРИЯТИЯ
// ======================================

const REGISTRATIONS_KEY = "dobroRiadomRegistrations";

// Список мероприятий должен совпадать с events.js
const eventsData = [
    {
        id: 1,
        title: "Чистый берег",
        date: "2026-11-20",
        time: "10:00",
        city: "Москва",
        place: "Парк Коломенское",
        direction: "Экология",
        description: "Совместная уборка территории парка и прилегающей набережной."
    },
    {
        id: 2,
        title: "Тёплые сердца",
        date: "2026-11-25",
        time: "12:00",
        city: "Волгоград",
        place: "Центр социальной помощи",
        direction: "Социальное",
        description: "Помощь в организации благотворительной встречи для пожилых людей."
    },
    {
        id: 3,
        title: "Учимся вместе",
        date: "2026-12-01",
        time: "15:00",
        city: "Москва",
        place: "Библиотека № 12",
        direction: "Образование",
        description: "Помощь школьникам с домашними заданиями и подготовкой к экзаменам."
    },
    {
        id: 4,
        title: "Фестиваль искусств",
        date: "2026-12-05",
        time: "11:00",
        city: "Санкт-Петербург",
        place: "Культурный центр",
        direction: "Культура",
        description: "Помощь организаторам городского фестиваля."
    },
    {
        id: 5,
        title: "Зелёный город",
        date: "2026-12-10",
        time: "09:30",
        city: "Казань",
        place: "Парк Победы",
        direction: "Экология",
        description: "Посадка деревьев и кустарников на территории городского парка."
    },
    {
        id: 6,
        title: "Поддержка каждому",
        date: "2026-12-15",
        time: "13:00",
        city: "Москва",
        place: "Волонтёрский центр",
        direction: "Социальное",
        description: "Сбор и сортировка гуманитарной помощи для нуждающихся семей."
    },
    {
        id: 7,
        title: "Помогаем животным",
        date: "2026-12-20",
        time: "10:00",
        city: "Москва",
        place: "Приют «Лапа помощи»",
        direction: "Социальное",
        description: "Помощь в уходе за животными и уборке вольеров."
    },
    {
        id: 8,
        title: "Новогоднее чудо",
        date: "2026-12-25",
        time: "14:00",
        city: "Волгоград",
        place: "Городской молодёжный центр",
        direction: "Культура",
        description: "Подготовка праздничной программы и подарков для детей."
    }
];

let activeTab = "upcoming";

const myEventsContainer = document.getElementById("myEventsContainer");
const myEventsEmpty = document.getElementById("myEventsEmpty");


// ======================================
// РАБОТА С LOCALSTORAGE
// ======================================

function getMyRegistrations() {
    try {
        const data = JSON.parse(localStorage.getItem(REGISTRATIONS_KEY));
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function saveMyRegistrations(registrations) {
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(registrations));
}


// ======================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ======================================

function getEventDate(event) {
    return new Date(event.date + "T00:00:00");
}

function formatEventDate(dateString) {
    return new Date(dateString + "T00:00:00").toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function escapeHTML(value) {
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

function isEventPast(event) {
    const eventDate = getEventDate(event);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return eventDate < today;
}


// ======================================
// ПОЛУЧЕНИЕ МЕРОПРИЯТИЙ
// ======================================

function getRegisteredEvents() {
    const registrations = getMyRegistrations();

    return registrations
        .map(registration => {
            const event = eventsData.find(
                item => item.id === Number(registration.eventId)
            );

            if (!event) return null;

            return {
                ...event,
                registrationId: registration.id,
                participantName: registration.name,
                participantEmail: registration.email
            };
        })
        .filter(Boolean)
        .sort((a, b) => getEventDate(a) - getEventDate(b));
}


// ======================================
// СТАТИСТИКА
// ======================================

function updateMyEventsStats() {
    const registeredEvents = getRegisteredEvents();

    const upcoming = registeredEvents.filter(event => !isEventPast(event));
    const past = registeredEvents.filter(event => isEventPast(event));

    document.getElementById("upcomingCount").textContent = upcoming.length;
    document.getElementById("pastCount").textContent = past.length;

    document.getElementById("upcomingTabCount").textContent = upcoming.length;
    document.getElementById("pastTabCount").textContent = past.length;
}


// ======================================
// ОТРИСОВКА МЕРОПРИЯТИЙ
// ======================================

function renderMyEvents() {
    const registeredEvents = getRegisteredEvents();

    const filteredEvents = registeredEvents.filter(event => {
        return activeTab === "upcoming"
            ? !isEventPast(event)
            : isEventPast(event);
    });

    myEventsContainer.innerHTML = "";

    if (filteredEvents.length === 0) {
        myEventsEmpty.hidden = false;

        const emptyTitle = document.getElementById("myEventsEmptyTitle");
        const emptyText = document.getElementById("myEventsEmptyText");

        if (activeTab === "upcoming") {
            emptyTitle.textContent = "Нет предстоящих мероприятий";
            emptyText.textContent = registeredEvents.length === 0
                ? "Вы ещё не записались ни на одно мероприятие. Самое время выбрать что-нибудь интересное!"
                : "У вас пока нет предстоящих мероприятий. Загляните в календарь и выберите новое событие.";
        } else {
            emptyTitle.textContent = "Прошедших мероприятий пока нет";
            emptyText.textContent = "Когда вы примете участие в мероприятиях, они появятся здесь.";
        }

        updateMyEventsStats();
        return;
    }

    myEventsEmpty.hidden = true;

    filteredEvents.forEach(event => {
        const card = document.createElement("article");
        card.className = "my-event-card";

        const statusClass = activeTab === "upcoming"
            ? "my-event-status--upcoming"
            : "my-event-status--past";

        const statusText = activeTab === "upcoming"
            ? "Предстоит участие"
            : "Мероприятие завершено";

        card.innerHTML = `
            <div class="my-event-card__main">
                <div class="my-event-card__top">
                    <span class="project-tag">${escapeHTML(event.direction)}</span>
                    <span class="my-event-status ${statusClass}">
                        ${statusText}
                    </span>
                </div>

                <h3>${escapeHTML(event.title)}</h3>

                <p class="my-event-card__description">
                    ${escapeHTML(event.description)}
                </p>

                <div class="my-event-card__details">
                    <span>
                        <i class="bi bi-calendar-event"></i>
                        ${formatEventDate(event.date)}
                    </span>

                    <span>
                        <i class="bi bi-clock"></i>
                        ${escapeHTML(event.time)}
                    </span>

                    <span>
                        <i class="bi bi-geo-alt"></i>
                        ${escapeHTML(event.city)}, ${escapeHTML(event.place)}
                    </span>
                </div>

                <div class="my-event-card__participant">
                    <i class="bi bi-person-circle"></i>
                    Запись оформлена на: <strong>${escapeHTML(event.participantName)}</strong>
                </div>
            </div>

            <div class="my-event-card__actions">
                ${
                    activeTab === "upcoming"
                        ? `<button type="button"
                            class="btn btn-outline-danger cancel-registration"
                            data-registration-id="${escapeHTML(event.registrationId)}">
                            <i class="bi bi-x-circle"></i>
                            Отменить запись
                           </button>`
                        : `<span class="my-event-completed">
                            <i class="bi bi-check-circle-fill"></i>
                            В архиве
                           </span>`
                }
            </div>
        `;

        myEventsContainer.appendChild(card);
    });

    updateMyEventsStats();
}


// ======================================
// ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК
// ======================================

document.querySelectorAll(".my-events-tab").forEach(button => {
    button.addEventListener("click", function () {
        activeTab = this.dataset.tab;

        document.querySelectorAll(".my-events-tab").forEach(tab => {
            tab.classList.toggle("active", tab === this);
        });

        renderMyEvents();
    });
});



 // ======================================
// ОТМЕНА ЗАПИСИ
// ======================================

myEventsContainer.addEventListener("click", function (event) {
    const button = event.target.closest(".cancel-registration");

    if (!button) return;

    const registrationId = Number(button.dataset.registrationId);

    const registration = getMyRegistrations().find(
        item => Number(item.id) === registrationId
    );

    if (!registration) return;

    const selectedEvent = eventsData.find(
        item => item.id === Number(registration.eventId)
    );

    const confirmed = confirm(
        `Вы действительно хотите отменить запись на мероприятие «${selectedEvent?.title || "Мероприятие"}»?`
    );

    if (!confirmed) return;

    const updatedRegistrations = getMyRegistrations().filter(
        item => Number(item.id) !== registrationId
    );

    saveMyRegistrations(updatedRegistrations);

    // Создаём уведомление об отмене
    if (typeof createNotification === "function") {
        createNotification({
            type: "cancellation",
            title: "Запись отменена",
            message: `Ваша запись на мероприятие «${selectedEvent?.title || "Мероприятие"}» отменена. Вы всегда можете записаться снова.`,
            eventId: registration.eventId,
            registrationId: registration.id
        });
    }

    renderMyEvents();

    alert("Ваша запись отменена. Место снова доступно для других участников.");
});



// ======================================
// СИНХРОНИЗАЦИЯ МЕЖДУ ВКЛАДКАМИ
// ======================================

window.addEventListener("storage", function (event) {
    if (event.key === REGISTRATIONS_KEY) {
        renderMyEvents();
    }
});


// ======================================
// ПЕРВОНАЧАЛЬНЫЙ ЗАПУСК
// ======================================

renderMyEvents();
