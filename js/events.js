
// ======================================
// МЕРОПРИЯТИЯ И КАЛЕНДАРЬ
// ======================================

const EVENTS_KEY = "dobroRiadomEvents";
const REGISTRATIONS_KEY = "dobroRiadomRegistrations";

// Демонстрационные мероприятия
const events = [
    {
        id: 1,
        title: "Чистый берег",
        date: "2026-11-20",
        time: "10:00",
        city: "Москва",
        place: "Парк Коломенское",
        direction: "Экология",
        description: "Совместная уборка территории парка и прилегающей набережной. Поможем сделать город чище!",
        capacity: 25
    },
    {
        id: 2,
        title: "Тёплые сердца",
        date: "2026-11-25",
        time: "12:00",
        city: "Волгоград",
        place: "Центр социальной помощи",
        direction: "Социальное",
        description: "Помощь в организации благотворительной встречи для пожилых людей.",
        capacity: 15
    },
    {
        id: 3,
        title: "Учимся вместе",
        date: "2026-12-01",
        time: "15:00",
        city: "Москва",
        place: "Библиотека № 12",
        direction: "Образование",
        description: "Помощь школьникам с домашними заданиями и подготовкой к экзаменам.",
        capacity: 12
    },
    {
        id: 4,
        title: "Фестиваль искусств",
        date: "2026-12-05",
        time: "11:00",
        city: "Санкт-Петербург",
        place: "Культурный центр",
        direction: "Культура",
        description: "Помощь организаторам городского фестиваля: встреча гостей и координация площадок.",
        capacity: 20
    },
    {
        id: 5,
        title: "Зелёный город",
        date: "2026-12-10",
        time: "09:30",
        city: "Казань",
        place: "Парк Победы",
        direction: "Экология",
        description: "Посадка деревьев и кустарников на территории городского парка.",
        capacity: 30
    },
    {
        id: 6,
        title: "Поддержка каждому",
        date: "2026-12-15",
        time: "13:00",
        city: "Москва",
        place: "Волонтёрский центр",
        direction: "Социальное",
        description: "Сбор и сортировка гуманитарной помощи для нуждающихся семей.",
        capacity: 18
    },
    {
        id: 7,
        title: "Помогаем животным",
        date: "2026-12-20",
        time: "10:00",
        city: "Москва",
        place: "Приют «Лапа помощи»",
        direction: "Социальное",
        description: "Помощь в уходе за животными, уборке вольеров и подготовке корма.",
        capacity: 10
    },
    {
        id: 8,
        title: "Новогоднее чудо",
        date: "2026-12-25",
        time: "14:00",
        city: "Волгоград",
        place: "Городской молодёжный центр",
        direction: "Культура",
        description: "Подготовка праздничной программы и подарков для детей.",
        capacity: 20
    }
];

let currentMonth = new Date(2026, 10, 1);
let selectedDate = null;

const calendarMonth = document.getElementById("calendarMonth");
const calendarDays = document.getElementById("calendarDays");
const eventsContainer = document.getElementById("eventsContainer");
const eventsEmpty = document.getElementById("eventsEmpty");
const eventsListTitle = document.getElementById("eventsListTitle");
const eventsListDescription = document.getElementById("eventsListDescription");
const myEventsCount = document.getElementById("myEventsCount");

const registrationModalElement = document.getElementById("registrationModal");
const registrationModal = new bootstrap.Modal(registrationModalElement);
const registrationForm = document.getElementById("registrationForm");


// ======================================
// РАБОТА С LOCALSTORAGE
// ======================================

function getRegistrations() {
    try {
        return JSON.parse(localStorage.getItem(REGISTRATIONS_KEY)) || [];
    } catch {
        return [];
    }
}

function saveRegistrations(registrations) {
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(registrations));
    updateMyEventsCount();
}

function getEventRegistrations(eventId) {
    return getRegistrations().filter(item => item.eventId === eventId);
}

function getAvailableSeats(event) {
    return Math.max(0, event.capacity - getEventRegistrations(event.id).length);
}


// ======================================
// ФОРМАТИРОВАНИЕ ДАТ
// ======================================

function formatDate(dateString) {
    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function formatShortDate(dateString) {
    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short"
    });
}


// ======================================
// ОТРИСОВКА КАЛЕНДАРЯ
// ======================================

function renderCalendar() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    calendarMonth.textContent = currentMonth.toLocaleDateString("ru-RU", {
        month: "long",
        year: "numeric"
    });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Понедельник — первый день недели
    const offset = (firstDay.getDay() + 6) % 7;

    calendarDays.innerHTML = "";

    // Дни предыдущего месяца
    for (let i = 0; i < offset; i++) {
        const emptyDay = document.createElement("div");
        emptyDay.className = "calendar-day calendar-day--empty";
        calendarDays.appendChild(emptyDay);
    }

    // Дни текущего месяца
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day);
        const dateString = [
            year,
            String(month + 1).padStart(2, "0"),
            String(day).padStart(2, "0")
        ].join("-");

        const dayEvents = events.filter(event => event.date === dateString);

        const button = document.createElement("button");
        button.type = "button";
        button.className = "calendar-day";
        button.textContent = day;

        if (dayEvents.length > 0) {
            button.classList.add("calendar-day--has-event");
        }

        if (selectedDate === dateString) {
            button.classList.add("calendar-day--selected");
        }

        const today = new Date();

        if (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        ) {
            button.classList.add("calendar-day--today");
        }

        button.addEventListener("click", function () {
            selectedDate = dateString;
            renderCalendar();
            renderEvents();
        });

        calendarDays.appendChild(button);
    }
}


// ======================================
// ОТРИСОВКА СПИСКА МЕРОПРИЯТИЙ
// ======================================

function renderEvents() {
    let filteredEvents = events;

    if (selectedDate) {
        filteredEvents = events.filter(event => event.date === selectedDate);

        eventsListTitle.textContent = formatDate(selectedDate);
        eventsListDescription.textContent = "Мероприятия на выбранную дату";
    } else {
        eventsListTitle.textContent = "Все ближайшие мероприятия";
        eventsListDescription.textContent = "Выберите событие и присоединяйтесь";
    }

    filteredEvents = [...filteredEvents].sort((a, b) =>
        new Date(a.date) - new Date(b.date)
    );

    eventsContainer.innerHTML = "";

    if (filteredEvents.length === 0) {
        eventsEmpty.hidden = false;
        return;
    }

    eventsEmpty.hidden = true;

    filteredEvents.forEach(event => {
        const availableSeats = getAvailableSeats(event);
        const isRegistered = getRegistrations().some(
            item => item.eventId === event.id
        );

        const card = document.createElement("article");
        card.className = "event-card";

        card.innerHTML = `
            <div class="event-card__date">
                <i class="bi bi-calendar-event"></i>
                <span>${formatShortDate(event.date)}</span>
                <span>${event.time}</span>
            </div>

            <div class="event-card__content">
                <div class="event-card__top">
                    <span class="project-tag">${event.direction}</span>
                    <span class="event-card__city">
                        <i class="bi bi-geo-alt"></i> ${event.city}
                    </span>
                </div>

                <h4>${event.title}</h4>
                <p>${event.description}</p>

                <div class="event-card__place">
                    <i class="bi bi-geo-alt-fill"></i>
                    ${event.place}
                </div>

                <div class="event-card__bottom">
                    <span class="event-card__seats">
                        <i class="bi bi-people"></i>
                        ${availableSeats} из ${event.capacity} мест свободно
                    </span>

                    ${
                        isRegistered
                            ? `<button class="btn btn-success" disabled>
                                <i class="bi bi-check-circle"></i> Вы записаны
                               </button>`
                            : availableSeats > 0
                                ? `<button class="btn btn-primary register-event"
                                    data-event-id="${event.id}">
                                    Записаться
                                   </button>`
                                : `<button class="btn btn-secondary" disabled>
                                    Мест нет
                                   </button>`
                    }
                </div>
            </div>
        `;

        eventsContainer.appendChild(card);
    });
}


// ======================================
// ОТКРЫТИЕ ФОРМЫ ЗАПИСИ
// ======================================

eventsContainer.addEventListener("click", function (event) {
    const button = event.target.closest(".register-event");

    if (!button) return;

    const eventId = Number(button.dataset.eventId);
    const selectedEvent = events.find(item => item.id === eventId);

    if (!selectedEvent) return;

    document.getElementById("registrationEventId").value = eventId;
    document.getElementById("registrationEventName").textContent =
        selectedEvent.title;

    document.getElementById("registrationError").hidden = true;

    registrationModal.show();
});



 // ======================================
// ОТПРАВКА ФОРМЫ
// ======================================

registrationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const eventId = Number(
        document.getElementById("registrationEventId").value
    );

    const name = document.getElementById("registrationName").value.trim();
    const email = document.getElementById("registrationEmail").value.trim();

    const selectedEvent = events.find(item => item.id === eventId);
    const errorBlock = document.getElementById("registrationError");

    if (!selectedEvent || !name || !email) {
        errorBlock.textContent = "Пожалуйста, заполните все поля.";
        errorBlock.hidden = false;
        return;
    }

    const registrations = getRegistrations();

    const alreadyRegistered = registrations.some(
        item => item.eventId === eventId &&
            item.email.toLowerCase() === email.toLowerCase()
    );

    if (alreadyRegistered) {
        errorBlock.textContent = "Вы уже записаны на это мероприятие.";
        errorBlock.hidden = false;
        return;
    }

    if (getAvailableSeats(selectedEvent) <= 0) {
        errorBlock.textContent = "К сожалению, свободных мест больше нет.";
        errorBlock.hidden = false;
        return;
    }

    const registration = {
        id: Date.now(),
        eventId,
        name,
        email,
        registeredAt: new Date().toISOString()
    };

    registrations.push(registration);

    saveRegistrations(registrations);

    // Создаём уведомление
    if (typeof createNotification === "function") {
        createNotification({
            type: "registration",
            title: "Вы записались на мероприятие!",
            message: `Вы успешно записались на мероприятие «${selectedEvent.title}». Дата: ${formatDate(selectedEvent.date)}, начало в ${selectedEvent.time}.`,
            eventId: selectedEvent.id,
            registrationId: registration.id
        });
    }

    registrationModal.hide();
    registrationForm.reset();

    renderCalendar();
    renderEvents();

    alert("Вы успешно записались на мероприятие!");
});


// ======================================
// ПЕРЕКЛЮЧЕНИЕ МЕСЯЦЕВ
// ======================================

document.getElementById("prevMonth").addEventListener("click", function () {
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    renderCalendar();
});

document.getElementById("nextMonth").addEventListener("click", function () {
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    renderCalendar();
});

document.getElementById("todayButton").addEventListener("click", function () {
    const today = new Date();

    currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    selectedDate = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    renderCalendar();
    renderEvents();
});

document.getElementById("showAllEvents").addEventListener("click", function () {
    selectedDate = null;
    renderCalendar();
    renderEvents();
});


// ======================================
// СЧЁТЧИК МОИХ МЕРОПРИЯТИЙ
// ======================================

function updateMyEventsCount() {
    if (!myEventsCount) return;

    myEventsCount.textContent = getRegistrations().length;
}


// ======================================
// СИНХРОНИЗАЦИЯ МЕЖДУ ВКЛАДКАМИ
// ======================================

window.addEventListener("storage", function (event) {
    if (event.key === REGISTRATIONS_KEY) {
        renderCalendar();
        renderEvents();
        updateMyEventsCount();
    }
});


// ======================================
// ПЕРВОНАЧАЛЬНЫЙ ЗАПУСК
// ======================================

renderCalendar();
renderEvents();
updateMyEventsCount();
