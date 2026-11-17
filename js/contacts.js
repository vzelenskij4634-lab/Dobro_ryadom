
// ======================================
// Форма обратной связи
// ======================================

const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("contactName");
    const email = document.getElementById("contactEmail");
    const subject = document.getElementById("contactSubject");
    const message = document.getElementById("contactMessage");

    const result = document.getElementById("contactMessageResult");

    const fields = [name, email, subject, message];

    let isValid = true;

    // Удаляем предыдущие ошибки
    fields.forEach(function (field) {
        field.classList.remove("is-invalid");
    });

    result.innerHTML = "";

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

    // Проверяем тему
    if (!subject.value) {
        subject.classList.add("is-invalid");
        isValid = false;
    }

    // Проверяем сообщение
    if (message.value.trim().length < 5) {
        message.classList.add("is-invalid");
        isValid = false;
    }

    // Если форма заполнена неправильно
    if (!isValid) {

        result.innerHTML =
            '<div class="alert alert-danger">Пожалуйста, заполните все обязательные поля.</div>';

        return;

    }

    // Имитация отправки
    result.innerHTML =
        '<div class="alert alert-success">Ваше сообщение успешно отправлено!</div>';

    contactForm.reset();

    fields.forEach(function (field) {
        field.classList.remove("is-invalid");
    });

});
