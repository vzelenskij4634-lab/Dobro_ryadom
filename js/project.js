
// ======================================
// Данные всех проектов
// ======================================

const projectData = {

    1: {
        title: "Чистый лес",
        subtitle: "Сделаем природу чище вместе!",
        direction: "Экология",
        description: "Проект направлен на очистку лесных территорий от бытового мусора. Участники помогут убрать загрязнённые участки, отсортировать отходы и привлечь внимание к проблеме экологии.",
        organizer: "ЭкоМир",
        date: "20 ноября 2026",
        city: "Москва",
        format: "Очное участие",
        image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1200",
        tasks: [
            "Сбор мусора на территории леса.",
            "Сортировка отходов.",
            "Помощь координаторам.",
            "Информирование посетителей."
        ]
    },

    2: {
        title: "Тёплые сердца",
        subtitle: "Поддержим тех, кому нужна помощь.",
        direction: "Социальное",
        description: "Волонтёры помогают пожилым людям и нуждающимся семьям. Проект направлен на создание комфортной среды и поддержку людей, оказавшихся в трудной жизненной ситуации.",
        organizer: "Помощь рядом",
        date: "25 ноября 2026",
        city: "Волгоград",
        format: "Очное участие",
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200",
        tasks: [
            "Помощь в организации встреч.",
            "Доставка необходимых вещей.",
            "Общение с участниками программы.",
            "Помощь координаторам."
        ]
    },

    3: {
        title: "Учимся вместе",
        subtitle: "Знания должны быть доступны каждому.",
        direction: "Образование",
        description: "Волонтёры помогают школьникам осваивать учебные предметы и развивать полезные навыки. Участие возможно полностью дистанционно.",
        organizer: "Образование каждому",
        date: "1 декабря 2026",
        city: "Москва",
        format: "Онлайн",
        image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200",
        tasks: [
            "Проведение онлайн-занятий.",
            "Подготовка учебных материалов.",
            "Ответы на вопросы школьников.",
            "Помощь в организации обучения."
        ]
    },

    4: {
        title: "Фестиваль искусств",
        subtitle: "Помогаем культуре объединять людей.",
        direction: "Культура",
        description: "Культурный фестиваль объединяет художников, музыкантов и зрителей. Волонтёры помогают провести мероприятие.",
        organizer: "Культурный центр",
        date: "5 декабря 2026",
        city: "Санкт-Петербург",
        format: "Очное участие",
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200",
        tasks: [
            "Встреча гостей.",
            "Помощь на площадках.",
            "Навигация посетителей.",
            "Поддержка организаторов."
        ]
    },

    5: {
        title: "Зелёный город",
        subtitle: "Добавим больше зелени в наши города.",
        direction: "Экология",
        description: "Экологическая инициатива по озеленению городских пространств и посадке новых деревьев.",
        organizer: "ЭкоКазань",
        date: "10 декабря 2026",
        city: "Казань",
        format: "Очное участие",
        image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200",
        tasks: [
            "Посадка деревьев.",
            "Подготовка территории.",
            "Уход за растениями.",
            "Помощь координаторам."
        ]
    },

    6: {
        title: "Поддержка каждому",
        subtitle: "Добрые дела не знают расстояний.",
        direction: "Социальное",
        description: "Удалённая помощь благотворительной организации в обработке обращений и информационной поддержке.",
        organizer: "Добрые дела",
        date: "15 декабря 2026",
        city: "Москва",
        format: "Онлайн",
        image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200",
        tasks: [
            "Обработка обращений.",
            "Информационная поддержка.",
            "Работа с материалами организации.",
            "Помощь в коммуникации."
        ]
    }

};


// ======================================
// Получаем ID из адресной строки
// ======================================

const urlParams = new URLSearchParams(window.location.search);

const projectId = urlParams.get("id") || "1";

const project = projectData[projectId];


// ======================================
// Заполняем страницу информацией
// ======================================

if (project) {

    document.title = project.title + " — Добро рядом";

    document.getElementById("projectTitle").textContent = project.title;

    document.getElementById("projectSubtitle").textContent =
        project.subtitle;

    document.getElementById("projectDirection").textContent =
        project.direction;

    document.getElementById("projectDescription").textContent =
        project.description;

    document.getElementById("projectOrganizer").textContent =
        project.organizer;

    document.getElementById("projectDate").textContent =
        project.date;

    document.getElementById("projectCity").textContent =
        project.city;

    document.getElementById("projectFormat").textContent =
        project.format;

    document.getElementById("projectImage").src = project.image;

    // Создаём список задач
    const tasksList = document.getElementById("projectTasks");

    project.tasks.forEach(function (task) {

        const li = document.createElement("li");

        li.textContent = task;

        tasksList.appendChild(li);

    });

} else {

    document.getElementById("projectTitle").textContent =
        "Проект не найден";

    document.getElementById("projectSubtitle").textContent =
        "Вернитесь в каталог и выберите другой проект.";

    document.getElementById("application").style.display = "none";

}


// ======================================
// Проверка и отправка заявки
// ======================================

const applicationForm = document.getElementById("applicationForm");

applicationForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("appName");
    const email = document.getElementById("appEmail");
    const phone = document.getElementById("appPhone");
    const age = document.getElementById("appAge");
    const role = document.getElementById("appRole");

    const message = document.getElementById("applicationMessage");

    let isValid = true;

    // Сбрасываем старые ошибки
    const fields = [name, email, phone, age, role];

    fields.forEach(function (field) {
        field.classList.remove("is-invalid");
    });

    message.innerHTML = "";

    // Проверяем имя
    if (name.value.trim().length < 2) {
        name.classList.add("is-invalid");
        isValid = false;
    }

    // Проверяем email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.value.trim())) {
        email.classList.add("is-invalid");
        isValid = false;
    }

    // Проверяем телефон
    const phoneDigits = phone.value.replace(/\D/g, "");

    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        phone.classList.add("is-invalid");
        isValid = false;
    }

    // Проверяем возраст
    const userAge = Number(age.value);

    if (!age.value || userAge < 14 || userAge > 100) {
        age.classList.add("is-invalid");
        isValid = false;
    }

    // Проверяем роль
    if (!role.value) {
        role.classList.add("is-invalid");
        isValid = false;
    }

    // Если есть ошибки
    if (!isValid) {

        message.innerHTML =
            '<div class="alert alert-danger">Проверьте правильность заполнения полей.</div>';

        return;

    }

    // Успешная отправка (демонстрация)
    message.innerHTML =
        '<div class="alert alert-success">Заявка успешно отправлена! Спасибо за желание помогать.</div>';

    applicationForm.reset();

    fields.forEach(function (field) {
        field.classList.remove("is-invalid");
    });

});
