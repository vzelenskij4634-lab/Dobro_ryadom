
/* =====================================
   Всплывающее окно оценки сайта
===================================== */

const RATING_STORAGE_KEY = "dobroRiadomRatings";
const RATING_POPUP_STATE_KEY = "dobroRiadomRatingPopupState";

const ratingPopup = document.getElementById("ratingPopup");
const closeRatingPopup = document.getElementById("closeRatingPopup");
const laterRating = document.getElementById("laterRating");
const sendRating = document.getElementById("sendRating");
const ratingPopupStars = document.querySelectorAll(
    "#ratingPopupStars button"
);
const ratingPopupLabel = document.getElementById("ratingPopupLabel");
const ratingPopupComment = document.getElementById("ratingPopupComment");
const ratingPopupResult = document.getElementById("ratingPopupResult");

let selectedRating = 0;
let popupShown = false;

const ratingDescriptions = {
    1: "Очень неудобно",
    2: "Есть над чем поработать",
    3: "В целом нормально",
    4: "Мне всё нравится",
    5: "Всё отлично!"
};

// Проверяем, нужно ли показывать окно
function canShowRatingPopup() {
    return true;
}

// Показываем окно
function showRatingPopup() {
    if (!ratingPopup || popupShown) {
        return;
    }

    popupShown = true;
    ratingPopup.classList.add("active");
}

// Закрываем окно
function hideRatingPopup(state) {
    if (!ratingPopup) return;

    ratingPopup.classList.remove("active");

    if (state) {
        localStorage.setItem(RATING_POPUP_STATE_KEY, state);
    }
}

// Следим за прокруткой страницы
window.addEventListener("scroll", function () {

    const scrollPosition = window.scrollY + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= pageHeight * 0.7) {
        showRatingPopup();
    }

});

// Выбор оценки
ratingPopupStars.forEach(function (star) {

    star.addEventListener("click", function () {

        selectedRating = Number(star.dataset.rating);

        ratingPopupStars.forEach(function (item) {
            const value = Number(item.dataset.rating);

            item.classList.toggle("active", value <= selectedRating);
        });

        ratingPopupLabel.textContent =
            ratingDescriptions[selectedRating];

        ratingPopupResult.innerHTML = "";
    });
});

// Отправка оценки
sendRating.addEventListener("click", function () {

    if (selectedRating === 0) {
        ratingPopupResult.innerHTML = `
            <div class="alert alert-warning py-2">
                Сначала выберите оценку.
            </div>
        `;
        return;
    }

    const ratings = JSON.parse(
        localStorage.getItem(RATING_STORAGE_KEY) || "[]"
    );

    const newRating = {
        id: Date.now(),
        rating: selectedRating,
        comment: ratingPopupComment.value.trim(),
        date: new Date().toISOString()
    };

    ratings.push(newRating);

    localStorage.setItem(
        RATING_STORAGE_KEY,
        JSON.stringify(ratings)
    );

    localStorage.setItem(RATING_POPUP_STATE_KEY, "completed");

    ratingPopup.innerHTML = `
        <div class="rating-popup-icon">
            <i class="bi bi-check-lg"></i>
        </div>
        <h3>Спасибо за вашу оценку!</h3>
        <p class="text-muted">
            Ваше мнение поможет нам сделать сайт лучше.
        </p>
        <button type="button" class="btn btn-primary w-100"
                id="finishRating">
            Отлично!
        </button>
    `;

    document.getElementById("finishRating").addEventListener(
        "click",
        function () {
            hideRatingPopup();
        }
    );
});

// Закрытие окна крестиком и кнопкой «Позже»
closeRatingPopup.addEventListener("click", function () {
    hideRatingPopup("closed");
});

laterRating.addEventListener("click", function () {
    hideRatingPopup("closed");
});

// Закрытие при нажатии на затемнённую область
ratingPopup.addEventListener("click", function (event) {
    if (event.target === ratingPopup) {
        hideRatingPopup("closed");
    }
});
