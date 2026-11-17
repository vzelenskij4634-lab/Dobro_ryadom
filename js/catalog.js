
// ======================================
// Данные проектов
// ======================================

const projectsData = {
    1: {
        title: "Чистый лес",
        description: "Экологическая акция по очистке лесной территории от мусора. Вместе мы сделаем природу чище!",
        organizer: "ЭкоМир",
        city: "Москва",
        date: "20 ноября 2026",
        image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800"
    },
    2: {
        title: "Тёплые сердца",
        description: "Социальная инициатива по поддержке пожилых людей и нуждающихся семей.",
        organizer: "Помощь рядом",
        city: "Волгоград",
        date: "25 ноября 2026",
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800"
    },
    3: {
        title: "Учимся вместе",
        description: "Образовательный проект для школьников, которым нужна помощь с учёбой.",
        organizer: "Образование каждому",
        city: "Москва",
        date: "1 декабря 2026",
        image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800"
    },
    4: {
        title: "Фестиваль искусств",
        description: "Помощь в организации культурного фестиваля, встреча гостей и работа на площадках.",
        organizer: "Культурный центр",
        city: "Санкт-Петербург",
        date: "5 декабря 2026",
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800"
    },
    5: {
        title: "Зелёный город",
        description: "Посадка деревьев и озеленение общественных пространств.",
        organizer: "ЭкоКазань",
        city: "Казань",
        date: "10 декабря 2026",
        image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800"
    },
    6: {
        title: "Поддержка каждому",
        description: "Удалённая помощь благотворительной организации в обработке обращений и информационной поддержке.",
        organizer: "Добрые дела",
        city: "Москва",
        date: "15 декабря 2026",
        image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800"
    }
};


// ======================================
// Избранное и localStorage
// ======================================

const FAVORITES_KEY = "dobroRiadomFavorites";

function getFavorites() {
    try {
        const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY));
        return Array.isArray(favorites) ? favorites.map(String) : [];
    } catch (error) {
        return [];
    }
}

function saveFavorites(favorites) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    updateFavoritesInterface();
}

function isFavorite(projectId) {
    return getFavorites().includes(String(projectId));
}

function toggleFavorite(projectId) {
    const favorites = getFavorites();
    const id = String(projectId);

    const updatedFavorites = favorites.includes(id)
        ? favorites.filter(item => item !== id)
        : [...favorites, id];

    saveFavorites(updatedFavorites);
    updateFavoriteButtons();

    return updatedFavorites.includes(id);
}


// ======================================
// Ссылка на избранное в навигации
// ======================================

function addFavoritesNavigation() {
    const navbar = document.querySelector(".navbar-nav");

    if (!navbar || navbar.querySelector(".favorites-nav-link")) return;

    const item = document.createElement("li");
    item.className = "nav-item";

    item.innerHTML = `
        <a class="nav-link favorites-nav-link" href="favorites.html">
            <i class="bi bi-heart"></i>
            Избранное
            <span class="favorites-count">0</span>
        </a>
    `;

    const contactsLink = Array.from(navbar.querySelectorAll(".nav-link"))
        .find(link => link.textContent.trim() === "Контакты");

    if (contactsLink) {
        contactsLink.closest(".nav-item").before(item);
    } else {
        navbar.appendChild(item);
    }
}


// ======================================
// Обновление счётчика избранного
// ======================================

function updateFavoritesInterface() {
    const count = getFavorites().length;

    document.querySelectorAll(".favorites-count").forEach(element => {
        element.textContent = count;
        element.hidden = count === 0;
    });
}


// ======================================
// Кнопки избранного на карточках
// ======================================

function createFavoriteButtons() {
    const projectCards = document.querySelectorAll(".project-item");

    projectCards.forEach(card => {
        const projectId = card.dataset.id;
        const actions = card.querySelector(".project-actions");

        if (!actions || actions.querySelector(".favorite-btn")) return;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "favorite-btn";
        button.dataset.id = projectId;

        button.innerHTML = `
            <i class="bi bi-heart"></i>
            <span>В избранное</span>
        `;

        button.addEventListener("click", function () {
            const added = toggleFavorite(projectId);

            button.classList.toggle("active", added);

            button.innerHTML = added
                ? '<i class="bi bi-heart-fill"></i><span>В избранном</span>'
                : '<i class="bi bi-heart"></i><span>В избранное</span>';
        });

        actions.appendChild(button);
    });

    updateFavoriteButtons();
}

function updateFavoriteButtons() {
    document.querySelectorAll(".favorite-btn").forEach(button => {
        const active = isFavorite(button.dataset.id);

        button.classList.toggle("active", active);

        button.innerHTML = active
            ? '<i class="bi bi-heart-fill"></i><span>В избранном</span>'
            : '<i class="bi bi-heart"></i><span>В избранное</span>';
    });
}

function updateFavoritesInterface() {
    const count = getFavorites().length;

    document.querySelectorAll(".favorites-count").forEach(element => {
        element.textContent = count;
        element.hidden = count === 0;
    });

    updateFavoriteButtons();
}


// ======================================
// Получаем элементы страницы
// ======================================

const directionFilter = document.getElementById("directionFilter");
const cityFilter = document.getElementById("cityFilter");
const formatFilter = document.getElementById("formatFilter");
const dateFilter = document.getElementById("dateFilter");

const applyFilters = document.getElementById("applyFilters");
const resetFilters = document.getElementById("resetFilters");

const projectSearch = document.getElementById("projectSearch");
const clearSearch = document.getElementById("clearSearch");
const sortProjects = document.getElementById("sortProjects");

const projectsContainer = document.getElementById("projectsContainer");
const projects = Array.from(document.querySelectorAll(".project-item"));

const projectCount = document.getElementById("projectCount");
const emptyMessage = document.getElementById("emptyMessage");


// ======================================
// Нормализация поискового запроса
// ======================================

function normalizeText(text) {
    return text.toLowerCase().trim().replace(/ё/g, "е");
}

function getProjectSearchText(project) {
    const data = projectsData[project.dataset.id];

    return normalizeText(
        (data ? data.title : "") + " " +
        (data ? data.description : "") + " " +
        (data ? data.organizer : "") + " " +
        project.textContent
    );
}


// ======================================
// Сортировка проектов
// ======================================

function sortProjectCards() {
    const sortType = sortProjects.value;
    const sortedProjects = [...projects];

    sortedProjects.sort(function (a, b) {
        if (sortType === "newest") {
            return b.dataset.date.localeCompare(a.dataset.date);
        }

        if (sortType === "oldest") {
            return a.dataset.date.localeCompare(b.dataset.date);
        }

        if (sortType === "popular") {
            return (Number(b.dataset.popularity) || 0) -
                   (Number(a.dataset.popularity) || 0);
        }

        return 0;
    });

    sortedProjects.forEach(project => {
        projectsContainer.appendChild(project);
    });
}


// ======================================
// Фильтрация и поиск проектов
// ======================================

function filterProjects() {
    const direction = directionFilter.value;
    const city = cityFilter.value;
    const format = formatFilter.value;
    const date = dateFilter.value;
    const searchQuery = normalizeText(projectSearch.value);

    let visibleCount = 0;

    projects.forEach(project => {
        const matchesDirection =
            !direction || project.dataset.direction === direction;

        const matchesCity =
            !city || project.dataset.city === city;

        const matchesFormat =
            !format || project.dataset.format === format;

        const matchesDate =
            !date || project.dataset.date === date;

        const matchesSearch =
            !searchQuery || getProjectSearchText(project).includes(searchQuery);

        const isVisible =
            matchesDirection &&
            matchesCity &&
            matchesFormat &&
            matchesDate &&
            matchesSearch;

        project.style.display = isVisible ? "" : "none";

        if (isVisible) visibleCount++;
    });

    projectCount.textContent = "Найдено проектов: " + visibleCount;
    emptyMessage.hidden = visibleCount !== 0;
}


// ======================================
// Обработчики фильтров
// ======================================

applyFilters.addEventListener("click", filterProjects);

projectSearch.addEventListener("input", filterProjects);

clearSearch.addEventListener("click", function () {
    projectSearch.value = "";
    filterProjects();
    projectSearch.focus();
});

sortProjects.addEventListener("change", function () {
    sortProjectCards();
    filterProjects();
});

resetFilters.addEventListener("click", function () {
    directionFilter.value = "";
    cityFilter.value = "";
    formatFilter.value = "";
    dateFilter.value = "";
    projectSearch.value = "";
    sortProjects.value = "newest";

    sortProjectCards();
    filterProjects();
});


// ======================================
// Быстрый просмотр проекта
// ======================================

document.querySelectorAll(".details-btn").forEach(button => {
    button.addEventListener("click", function () {
        const projectId = button.dataset.id;
        const project = projectsData[projectId];

        if (!project) return;

        document.getElementById("modalTitle").textContent = project.title;
        document.getElementById("modalDescription").textContent = project.description;

        document.getElementById("modalInfo").textContent =
            "Организатор: " + project.organizer +
            " | Город: " + project.city +
            " | Дата: " + project.date;

        document.getElementById("modalImage").src = project.image;
        document.getElementById("modalLink").href = "project.html?id=" + projectId;

        const modalElement = document.getElementById("projectModal");
        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

        modal.show();
    });
});


// ======================================
// Первоначальная настройка
// ======================================

addFavoritesNavigation();
createFavoriteButtons();
updateFavoritesInterface();

sortProjectCards();
filterProjects();


// Обновление при изменении избранного в другой вкладке
window.addEventListener("storage", function (event) {
    if (event.key === FAVORITES_KEY) {
        updateFavoritesInterface();
    }
});
