
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
        direction: "Экология",
        format: "Очно",
        image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800"
    },
    2: {
        title: "Тёплые сердца",
        description: "Социальная инициатива по поддержке пожилых людей и нуждающихся семей.",
        organizer: "Помощь рядом",
        city: "Волгоград",
        date: "25 ноября 2026",
        direction: "Социальное",
        format: "Очно",
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800"
    },
    3: {
        title: "Учимся вместе",
        description: "Образовательный проект для школьников, которым нужна помощь с учёбой.",
        organizer: "Образование каждому",
        city: "Москва",
        date: "1 декабря 2026",
        direction: "Образование",
        format: "Онлайн",
        image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800"
    },
    4: {
        title: "Фестиваль искусств",
        description: "Помощь в организации культурного фестиваля, встреча гостей и работа на площадках.",
        organizer: "Культурный центр",
        city: "Санкт-Петербург",
        date: "5 декабря 2026",
        direction: "Культура",
        format: "Очно",
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800"
    },
    5: {
        title: "Зелёный город",
        description: "Посадка деревьев и озеленение общественных пространств.",
        organizer: "ЭкоКазань",
        city: "Казань",
        date: "10 декабря 2026",
        direction: "Экология",
        format: "Очно",
        image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800"
    },
    6: {
        title: "Поддержка каждому",
        description: "Удалённая помощь благотворительной организации в обработке обращений и информационной поддержке.",
        organizer: "Добрые дела",
        city: "Москва",
        date: "15 декабря 2026",
        direction: "Социальное",
        format: "Онлайн",
        image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800"
    }
};

const FAVORITES_KEY = "dobroRiadomFavorites";


// ======================================
// Работа с избранным
// ======================================

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
}

function updateFavoritesCount() {
    const count = getFavorites().length;

    document.querySelectorAll(".favorites-count").forEach(element => {
        element.textContent = count;
        element.hidden = count === 0;
    });
}


// ======================================
// Навигация
// ======================================

function addFavoritesNavigation() {
    const navbar = document.querySelector(".navbar-nav");

    if (!navbar || navbar.querySelector(".favorites-nav-link")) return;

    const item = document.createElement("li");
    item.className = "nav-item";

    item.innerHTML = `
        <a class="nav-link active favorites-nav-link" href="favorites.html">
            <i class="bi bi-heart-fill"></i>
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
// Отображение карточек
// ======================================

const favoritesContainer = document.getElementById("favoritesContainer");
const favoritesEmpty = document.getElementById("favoritesEmpty");
const favoritesCount = document.getElementById("favoritesPageCount");

function renderFavorites() {
    const favorites = getFavorites();

    favoritesContainer.innerHTML = "";

    const validFavorites = favorites.filter(id => projectsData[id]);

    if (validFavorites.length !== favorites.length) {
        saveFavorites(validFavorites);
    }

    favoritesCount.textContent =
        "Сохранено проектов: " + validFavorites.length;

    favoritesEmpty.hidden = validFavorites.length !== 0;
    favoritesContainer.hidden = validFavorites.length === 0;

    validFavorites.forEach(id => {
        const project = projectsData[id];

        const card = document.createElement("div");
        card.className = "col-md-6";

        card.innerHTML = `
            <div class="project-card favorite-project-card">
                <img src="${project.image}" alt="${project.title}">

                <div class="project-card__body">
                    <span class="project-tag">${project.direction}</span>

                    <h3>${project.title}</h3>

                    <p>${project.description}</p>
                    <p><i class="bi bi-person"></i> Организатор: ${project.organizer}</p>
                    <p><i class="bi bi-calendar"></i> ${project.date}</p>
                    <p><i class="bi bi-geo-alt"></i> ${project.city}</p>
                    <p><i class="bi bi-people"></i> ${project.format}</p>

                    <div class="project-actions">
                        <a href="project.html?id=${id}" class="btn btn-primary">
                            Подробнее
                        </a>

                        <button type="button"
                                class="btn btn-outline-danger remove-favorite"
                                data-id="${id}">
                            <i class="bi bi-heartbreak"></i>
                            Удалить
                        </button>
                    </div>
                </div>
            </div>
        `;

        favoritesContainer.appendChild(card);
    });

    updateFavoritesCount();
}


// ======================================
// Удаление из избранного
// ======================================

favoritesContainer.addEventListener("click", function (event) {
    const button = event.target.closest(".remove-favorite");

    if (!button) return;

    const id = button.dataset.id;

    const updatedFavorites = getFavorites().filter(item => item !== id);

    saveFavorites(updatedFavorites);
    renderFavorites();
});


// ======================================
// Инициализация
// ======================================

addFavoritesNavigation();
renderFavorites();

window.addEventListener("storage", function (event) {
    if (event.key === FAVORITES_KEY) {
        renderFavorites();
    }
});
