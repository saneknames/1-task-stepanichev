let students = [];

let eventId = null;
let activeSort = 'score';

const saveButton = document.getElementById('saveButton');

function saveToStorage() {
    localStorage.setItem('students', JSON.stringify(students));
}

function loadFromStorage() {
    const data = localStorage.getItem('students');
    if (data !== null) {
        students = JSON.parse(data);
    }
}

function startActions() {
    saveButton.addEventListener('click', () => {
        const lastName = document.getElementById('lastName').value;
        const firstName = document.getElementById('firstName').value;
        const middleName = document.getElementById('middleName').value;
        const enrollmentType = document.getElementById('enrollmentType').value;
        const avgScore = document.getElementById('avgScore').value;
        const phone = document.getElementById('phone').value;
        const birthDate = document.getElementById('birthDate').value;

        if (eventId === null) {
            const student = {
                id: Date.now(),
                lastName: lastName,
                firstName: firstName,
                middleName: middleName,
                enrollmentType: enrollmentType,
                avgScore: avgScore,
                phone: phone,
                birthDate: birthDate,
                active: true
            };
            students.push(student);
        } else {
            for (let i = 0; i < students.length; i++) {
                if (students[i].id === eventId) {
                    students[i].lastName = lastName;
                    students[i].firstName = firstName;
                    students[i].middleName = middleName;
                    students[i].enrollmentType = enrollmentType;
                    students[i].avgScore = avgScore;
                    students[i].phone = phone;
                    students[i].birthDate = birthDate;
                }
            }
        }

        clearForm();
        eventId = null;
        saveButton.textContent = 'Добавить';
        document.getElementById('formTitle').textContent = 'Добавление студента';
        document.getElementById('cancelButton').style.display = 'none';
        validateForm();
        saveToStorage();
        showStudents();

    });

    document.getElementById('deleteYes').addEventListener('click', () => {
        for (let i = 0; i < students.length; i++) {
            if (students[i].id === eventId) {
                students[i].active = false;
            }
        }
        document.getElementById('deleteWindow').classList.remove('show');
        eventId = null;
        saveToStorage();
        showStudents();
    });

    document.getElementById('deleteNo').addEventListener('click', () => {
        document.getElementById('deleteWindow').classList.remove('show');
        eventId = null;
    });

    document.getElementById('deleteClose').addEventListener('click', () => {
        document.getElementById('deleteWindow').classList.remove('show');
        eventId = null;
    });

    document.getElementById('cancelButton').addEventListener('click', () => {
        clearForm();
        eventId = null;
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
    document.getElementById('searchFio').addEventListener('input', showStudents);

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

function isValidName(value) {
    if (value === '') {
        return false;
    }
    for (let i = 0; i < value.length; i++) {
        if (value[i] >= '0' && value[i] <= '9') {
            return false;
        }
    }
    return true;
}

function getDigits(value) {
    let digits = '';
    for (let i = 0; i < value.length; i++) {
        if (value[i] >= '0' && value[i] <= '9') {
            digits = digits + value[i];
        }
    }
    return digits;
}

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

function isValidPhone(value) {
    const digits = getDigits(value);
    return digits.length === 11;
}

function isValidDate(value) {
    if (value === '') {
        return false
    }
    return true
}

function isAge(value) {
    const birth = new Date(value).getTime();
    const now = new Date().getTime();
    const years = 17 * 365 * 24 * 60 * 60 * 1000
    return now - birth >= years;
}

function clearForm() {
    document.getElementById('lastName').value = '';
    document.getElementById('firstName').value = '';
    document.getElementById('middleName').value = '';
    document.getElementById('enrollmentType').value = '';
    document.getElementById('avgScore').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('birthDate').value = '';
}

function createCard(s) {
    return '<h3>' + s.lastName + ' ' + s.firstName + ' ' + s.middleName + '</h3>' +
    '<p>Тип набора: ' + s.enrollmentType + '</p>' +
    '<p>Средний балл: ' + s.avgScore + '</p>' +
    '<p>Телефон: ' + s.phone + '</p>' +
    '<p>Дата рождения: ' + s.birthDate + '</p>' +
    '<p>Статус: ' + (s.active ? 'активный' : 'неактивный') + '</p>';
}

function showStudents() {
    const list = document.getElementById('studentsList');
    list.innerHTML = '';

    const filterType = document.getElementById('filter').value;
    const searchFio = document.getElementById('searchFio').value.toLowerCase();
    const showActive = document.getElementById('showActive').checked;
    const showInactive = document.getElementById('showInactive').checked;

    let result = students.slice();

    if (filterType !== '') {
        result = result.filter((s) => {
            return s.enrollmentType === filterType;
        });
    }

    if (searchFio !== '') {
        result = result.filter((s) => {
            const fio = (s.lastName + ' ' + s.firstName + ' ' + s.middleName).toLowerCase();
            return fio.indexOf(searchFio) !== -1;
        });
    }

    result = result.filter((s) => {
        if (s.active && showActive) {
            return true;
        }
        if (!s.active && showInactive) {
            return true;
        }
        return false;
    });

    if (activeSort === 'score') {
        const sortScore = document.getElementById('sortScore').value;
        result.sort((previous, next) => {
            if (sortScore === 'up') {
                return previous.avgScore - next.avgScore;
            } else {
                return next.avgScore - previous.avgScore;
            }
        });
    } else {
        const sortBirth = document.getElementById('sortBirth').value;
        result.sort((previous, next) => {
            if (sortBirth === 'up') {
                return new Date(previous.birthDate).getTime() - new Date(next.birthDate).getTime();
            } else {
                return new Date(next.birthDate).getTime() - new Date(previous.birthDate).getTime();
            }
        });
    }

    for (let i = 0; i < result.length; i++) {
        const s = result[i];

        const card = document.createElement('div');
        card.className = 'student-card ' + (s.active ? 'active' : 'inactive');

        let cardHtml = createCard(s);

        if (s.active) {
            cardHtml = cardHtml +
                '<div class="actions">' +
                    '<button class="edit">✎</button>' +
                    '<button class="delete">✕</button>' +
                '</div>';
        }

        card.innerHTML = cardHtml;

        if (s.active) {
            card.querySelector('.edit').addEventListener('click', () => {
                editStudent(s.id);
            });

            card.querySelector('.delete').addEventListener('click', () => {
                deleteStudent(s.id);
            });
        }

        list.appendChild(card);
    }
}

function editStudent(id) {
    for (let i = 0; i < students.length; i++) {
        if (students[i].id === id) {
            const s = students[i];
            document.getElementById('lastName').value = s.lastName;
            document.getElementById('firstName').value = s.firstName;
            document.getElementById('middleName').value = s.middleName;
            document.getElementById('enrollmentType').value = s.enrollmentType;
            document.getElementById('avgScore').value = s.avgScore;
            document.getElementById('phone').value = s.phone;
            document.getElementById('birthDate').value = s.birthDate;

            eventId = id;
            saveButton.textContent = 'Сохранить';
            document.getElementById('formTitle').textContent = 'Редактирование студента';
            document.getElementById('cancelButton').style.display = 'block';
            validateForm();
        }
    }
}

function deleteStudent(id) {
    clearForm();
    saveButton.textContent = 'Добавить';
    document.getElementById('formTitle').textContent = 'Добавление студента';
    document.getElementById('cancelButton').style.display = 'none';

    eventId = id;

    for (let i = 0; i < students.length; i++) {
        if (students[i].id === id) {
            const s = students[i];
            const fio = s.lastName + ' ' + s.firstName + ' ' + s.middleName;
            document.getElementById('deleteName').textContent = fio;
        }
    }

    document.getElementById('deleteWindow').classList.add('show');
}

loadFromStorage();
startActions();
validateForm();
showStudents();