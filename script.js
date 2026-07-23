let students = [];

let selectedStudentId = null;
let activeSort = 'score';

const saveButton = document.getElementById('saveButton');
/**
 * Сохранение массива студентов в localStorage
 */
function saveToStorage() {
    localStorage.setItem('students', JSON.stringify(students));
}
/**
 * Загрузка массива студентов из localStorage при запуске
 */
function loadFromStorage() {
    const data = localStorage.getItem('students');
    if (data) {
        students = JSON.parse(data);
    }
}
/**
 * Обработчик событий
 */
function startActions() {
    saveButton.addEventListener('click', () => {
        const lastName = document.getElementById('lastName').value;
        const firstName = document.getElementById('firstName').value;
        const middleName = document.getElementById('middleName').value;
        const enrollmentType = document.getElementById('enrollmentType').value;
        const avgScore = document.getElementById('avgScore').value;
        const phone = document.getElementById('phone').value;
        const birthDate = document.getElementById('birthDate').value;

        const student = {
            id: !selectedStudentId ? Date.now() : selectedStudentId,
            lastName: lastName,
            firstName: firstName,
            middleName: middleName,
            enrollmentType: enrollmentType,
            avgScore: avgScore,
            phone: phone,
            birthDate: birthDate,
            active: true
        };

        if (!selectedStudentId) {
            students.push(student);
        } else {
            for (let i = 0; i < students.length; i++) {
                if (students[i].id === selectedStudentId) {
                    students[i] = student;
                }
            }
        }

        clearForm();
        selectedStudentId = null;
        saveButton.textContent = 'Добавить';
        document.getElementById('formTitle').textContent = 'Добавление студента';
        document.getElementById('cancelButton').style.display = 'none';
        validateForm();
        saveToStorage();
        showStudents();

    });

    document.getElementById('deleteYes').addEventListener('click', () => {
        for (let i = 0; i < students.length; i++) {
            if (students[i].id === selectedStudentId) {
                students[i].active = false;
            }
        }
        document.getElementById('deleteWindow').classList.remove('show');
        selectedStudentId = null;
        saveToStorage();
        showStudents();
    });

    document.getElementById('deleteNo').addEventListener('click', () => {
        document.getElementById('deleteWindow').classList.remove('show');
        selectedStudentId = null;
    });

    document.getElementById('deleteClose').addEventListener('click', () => {
        document.getElementById('deleteWindow').classList.remove('show');
        selectedStudentId = null;
    });

    document.getElementById('cancelButton').addEventListener('click', () => {
        clearForm();
        selectedStudentId = null;
        saveButton.textContent = 'Добавить';
        document.getElementById('formTitle').textContent = 'Добавление студента';
        document.getElementById('cancelButton').style.display = 'none';
        validateForm();
    });

    document.getElementById('lastName').addEventListener('input', validateForm);
    document.getElementById('firstName').addEventListener('input', validateForm);
    document.getElementById('middleName').addEventListener('input', validateForm);
    document.getElementById('enrollmentType').addEventListener('change', validateForm);
    document.getElementById('avgScore').addEventListener('input', validateForm);
    document.getElementById('phone').addEventListener('input', validateForm);
    document.getElementById('birthDate').addEventListener('input', validateForm);

    document.getElementById('filter').addEventListener('change', showStudents);
    document.getElementById('searchFullName').addEventListener('input', showStudents);

    document.getElementById('sortScore').addEventListener('change', () => {
        activeSort = 'score';
        showStudents();
    });

    document.getElementById('sortBirth').addEventListener('change', () => {
        activeSort = 'birth';
        showStudents();
    });

    document.getElementById('showActive').addEventListener('change', showStudents);
    document.getElementById('showInactive').addEventListener('change', showStudents);
}
/**
 * Проверка формы и блокировка кнопки при ошибках
 */
function validateForm() {
    const lastName = document.getElementById('lastName').value;
    const firstName = document.getElementById('firstName').value;
    const enrollmentType = document.getElementById('enrollmentType').value;
    const avgScore = document.getElementById('avgScore').value;
    const phone = document.getElementById('phone').value;
    const birthDate = document.getElementById('birthDate').value;

    let valid = true;

    if (!isValidName(lastName)) {
        valid = false
    }
    if (!isValidName(firstName)) {
        valid = false;
    }
    if (enrollmentType === '') {
        valid = false;
    }
    if (!isValidScore(avgScore)) {
        valid = false;
    }
    if (!isValidPhone(phone)) {
        valid = false;
    }
    if (!isValidDate(birthDate)) {
        valid = false;
    }
    if (!isAge(birthDate)) {
        valid = false;
    }

    saveButton.disabled = !valid;
}
/**
 * Проверка имени: не пустое и без цифр
 * @param {string} value - имя
 */
function isValidName(value) {
    if (value === '') {
        return false;
    }

    const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    for (let i = 0; i < digits.length; i++) {
        if (value.includes(digits[i])) {
            return false;
        }
    }

    return true;
}
/**
 * Проверка среднего балла: от 2 до 5
 * @param {string} value - балл
 */
function isValidScore(value) {
    const score = parseFloat(value);
    if (isNaN(score)) {
        return false;
    }
    if (score < 2 || score > 5) {
        return false;
    }
    return true;
}
/**
 * Проверка телефона: ровно 11 цифр
 * @param {string} value - номер телефона
 */
function isValidPhone(value) {
    const digits = value.replace(/\D/g, '');
    return digits.length === 11;
}
/**
 * Проверка на заполнение даты
 * @param {string} value - дата
 */
function isValidDate(value) {
    if (value === '') {
        return false
    }
    return true
}
/**
 * Проверка возраста: не меньше 17 лет
 * @param {string} value - дата рождения
 */
function isAge(value) {
    const birth = new Date(value).getTime();
    const now = new Date().getTime();
    const years = 17 * 365 * 24 * 60 * 60 * 1000
    return now - birth >= years;
}
/**
 * Очистка полей формы
 */
function clearForm() {
    document.getElementById('lastName').value = '';
    document.getElementById('firstName').value = '';
    document.getElementById('middleName').value = '';
    document.getElementById('enrollmentType').value = '';
    document.getElementById('avgScore').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('birthDate').value = '';
}

/**
 * Возвращает название типа набора по id
 * @param {string} id - идентификатор типа набора студента
 */
function getEnrollmentName(id) {
    if (id === '1') {
        return 'Бюджетный';
    }
    if (id === '2') {
        return 'Целевой';
    }
    if (id === '3') {
        return 'Коммерческий';
    }
    return '';
}
/**
 * Создание карточки студента
 * @param {object} student - студент
 */
function createCard(student) {
    return '<h3>' + student.lastName + ' ' + student.firstName + ' ' + student.middleName + '</h3>' +
    '<p>Тип набора: ' + getEnrollmentName(student.enrollmentType) + '</p>' +
    '<p>Средний балл: ' + student.avgScore + '</p>' +
    '<p>Телефон: ' + student.phone + '</p>' +
    '<p>Дата рождения: ' + student.birthDate + '</p>' +
    '<p>Статус: ' + (student.active ? 'активный' : 'неактивный') + '</p>';
}

/**
 * Отрисовка одного студента в списке
 * @param {object} student - студент
 * @param {HTMLElement} list - контейнер для карточек
 */
function outputStudents(student, list) {
    const card = document.createElement('div');
    card.className = 'student-card ' + (student.active ? 'active' : 'inactive');

    let cardHtml = createCard(student);

    if (student.active) {
        cardHtml = cardHtml +
            '<div class="actions">' +
                '<button class="edit">✎</button>' +
                '<button class="delete">✕</button>' +
            '</div>';
    }

    card.innerHTML = cardHtml;

    if (student.active) {
        card.querySelector('.edit').addEventListener('click', () => {
            editStudent(student.id);
        });

        card.querySelector('.delete').addEventListener('click', () => {
            deleteStudent(student.id);
        });
    }

    list.appendChild(card);
}

/**
 * Показ списка студентов с фильтрами и сортировкой
 */
function showStudents() {
    const list = document.getElementById('studentsList');
    list.innerHTML = '';

    const filterType = document.getElementById('filter').value;
    const searchFullName = document.getElementById('searchFullName').value.toLowerCase();
    const showActive = document.getElementById('showActive').checked;
    const showInactive = document.getElementById('showInactive').checked;

    let result = students.slice();
    result = result.filter((student) => {
        const fullName = (student.lastName + ' ' + student.firstName + ' ' + student.middleName).toLowerCase();

        return (filterType === '' || student.enrollmentType === filterType) &&
            (searchFullName.length < 2 || fullName.indexOf(searchFullName) !== -1) &&
            ((student.active && showActive) || (!student.active && showInactive));
    });

    if (activeSort === 'score') {
        const sortScore = document.getElementById('sortScore').value;
        sortByScore(result, sortScore);
    } else {
        const sortBirth = document.getElementById('sortBirth').value;
        sortByBirth(result, sortBirth);
    }
    for (let i = 0; i < result.length; i++) {
        outputStudents(result[i], list);
    }
}

/**
 * Сортировка студентов по среднему баллу
 * @param {Array} list - массив студентов
 * @param {string} direction - направление сортировки
 */
function sortByScore(list, direction) {
    list.sort((previous, next) => {
        if (direction === '1') {
            return previous.avgScore - next.avgScore;
        } else {
            return next.avgScore - previous.avgScore;
        }
    });
}

/**
 * Сортировка студентов по дате рождения
 * @param {Array} list - массив студентов
 * @param {string} direction - направление сортировки
 */
function sortByBirth(list, direction) {
    list.sort((previous, next) => {
        if (direction === '1') {
            return new Date(previous.birthDate).getTime() - new Date(next.birthDate).getTime();
        } else {
            return new Date(next.birthDate).getTime() - new Date(previous.birthDate).getTime();
        }
    });
}

/**
 * Редактирование студента
 * @param {number} id - идентификатор выбранного студента
 */
function editStudent(id) {
    for (let i = 0; i < students.length; i++) {
        if (students[i].id === id) {
            const student = students[i];
            document.getElementById('lastName').value = student.lastName;
            document.getElementById('firstName').value = student.firstName;
            document.getElementById('middleName').value = student.middleName;
            document.getElementById('enrollmentType').value = student.enrollmentType;
            document.getElementById('avgScore').value = student.avgScore;
            document.getElementById('phone').value = student.phone;
            document.getElementById('birthDate').value = student.birthDate;

            selectedStudentId = id;
            saveButton.textContent = 'Сохранить';
            document.getElementById('formTitle').textContent = 'Редактирование студента';
            document.getElementById('cancelButton').style.display = 'block';
            validateForm();
        }
    }
}
/**
 * Удаление студента
 * @param {number} id - идентификатор выбранного студента
 */
function deleteStudent(id) {
    clearForm();
    selectedStudentId = null;
    saveButton.textContent = 'Добавить';
    document.getElementById('formTitle').textContent = 'Добавление студента';
    document.getElementById('cancelButton').style.display = 'none';

    selectedStudentId = id;

    for (let i = 0; i < students.length; i++) {
        if (students[i].id === id) {
            const student = students[i];
            const fullName = student.lastName + ' ' + student.firstName + ' ' + student.middleName;
            document.getElementById('deleteName').textContent = fullName;
        }
    }

    document.getElementById('deleteWindow').classList.add('show');
}

loadFromStorage();
startActions();
validateForm();
showStudents();