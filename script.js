let students = [];

let editId = null;
let deleteId = null;
let activeSort = 'score';

const saveBtn = document.getElementById('saveBtn');

saveBtn.addEventListener('click', function () {
    const lastName = document.getElementById('lastName').value;
    const firstName = document.getElementById('firstName').value;
    const middleName = document.getElementById('middleName').value;
    const enrollmentType = document.getElementById('enrollmentType').value;
    const avgScore = document.getElementById('avgScore').value;
    const phone = document.getElementById('phone').value;
    const birthDate = document.getElementById('birthDate').value;

    if (editId === null) {
        const student = {
            id: Date.now(),
            lastName: lastName,
            firstName: firstName,
            middleName: middleName,
            enrollmentType: enrollmentType,
            avgScore: avgScore,
            phone: formatPhone(phone),
            birthDate: birthDate,
            active: true
        };
        students.push(student);
    } else {
        for (let i = 0; i < students.length; i++) {
            if (students[i].id === editId) {
                students[i].lastName = lastName;
                students[i].firstName = firstName;
                students[i].middleName = middleName;
                students[i].enrollmentType = enrollmentType;
                students[i].avgScore = avgScore;
                students[i].phone = formatPhone(phone);
                students[i].birthDate = birthDate;
            }
        }
        editId = null;
        saveBtn.textContent = 'Добавить';
    }

    clearForm();
    validateForm();
    showStudents();
});

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
    if (!isValidName(firstName)) valid = false;
    if (enrollmentType === '') valid = false;
    if (!isValidScore(avgScore)) valid = false;
    if (!isValidPhone(phone)) valid = false;
    if (!isValidDate(birthDate)) valid = false;
    if (!isAge(birthDate)) valid = false;

    saveBtn.disabled = !valid;
}

function isValidName(value) {
    if (value === '') return false;
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
    if (isNaN(score)) return false;
    if (score < 2 || score > 5) return false;
    return true;
}

function isValidPhone(value) {
    const digits = getDigits(value);
    return digits.length === 11;
}

function formatPhone(value) {
    const digits = getDigits(value);
    return '+7' + digits.substring(1);
}

function isValidDate(value) {
    const parts = value.split('.');
    if (parts.length !== 3) return false;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
    if (day < 1 || day > 31) return false;
    if (month < 1 || month > 12) return false;
    if (year < 1900 || year > 2100) return false;

    return true;
}

function isAge(value) {
    const parts = value.split('.');
    const year = parseInt(parts[2], 10);
    const nowYear = new Date().getFullYear();
    return nowYear - year >= 16;
}

function dateToNumber(value) {
    const parts = value.split('.');
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    return parseInt(year + month + day, 10);
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

function showStudents() {
    const list = document.getElementById('studentsList');
    list.innerHTML = '';

    const filterType = document.getElementById('filter').value;
    const searchFio = document.getElementById('searchFio').value.toLowerCase();
    const showActive = document.getElementById('showActive').checked;
    const showInactive = document.getElementById('showInactive').checked;

    let result = students.slice();

    if (filterType !== '') {
        result = result.filter(function (s) {
            return s.enrollmentType === filterType;
        });
    }

    if (searchFio !== '') {
        result = result.filter(function (s) {
            const fio = (s.lastName + ' ' + s.firstName + ' ' + s.middleName).toLowerCase();
            return fio.indexOf(searchFio) !== -1;
        });
    }

    result = result.filter(function (s) {
        if (s.active && showActive) return true;
        if (!s.active && showInactive) return true;
        return false;
    });

    if (activeSort === 'score') {
        const sortScore = document.getElementById('sortScore').value;
        result.sort(function (a, b) {
            if (sortScore === 'up') {
                return a.avgScore - b.avgScore;
            } else {
                return b.avgScore - a.avgScore;
            }
        });
    } else {
        const sortBirth = document.getElementById('sortBirth').value;
        result.sort(function (a, b) {
            if (sortBirth === 'up') {
                return dateToNumber(a.birthDate) - dateToNumber(b.birthDate);
            } else {
                return dateToNumber(b.birthDate) - dateToNumber(a.birthDate);
            }
        });
    }

    for (let i = 0; i < result.length; i++) {
        const s = result[i];

        const card = document.createElement('div');
        card.className = 'student-card ' + (s.active ? 'active' : 'inactive');

        let cardHtml =
            '<h3>' + s.lastName + ' ' + s.firstName + ' ' + s.middleName + '</h3>' +
            '<p>Тип набора: ' + s.enrollmentType + '</p>' +
            '<p>Средний балл: ' + s.avgScore + '</p>' +
            '<p>Телефон: ' + s.phone + '</p>' +
            '<p>Дата рождения: ' + s.birthDate + '</p>' +
            '<p>Статус: ' + (s.active ? 'активный' : 'неактивный') + '</p>';

        if (s.active) {
            cardHtml = cardHtml +
                '<div class="actions">' +
                    '<button class="edit">✎</button>' +
                    '<button class="delete">✕</button>' +
                '</div>';
        }

        card.innerHTML = cardHtml;

        if (s.active) {
            card.querySelector('.edit').addEventListener('click', function () {
                editStudent(s.id);
            });

            card.querySelector('.delete').addEventListener('click', function () {
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

            editId = id;
            saveBtn.textContent = 'Сохранить';
            validateForm();
        }
    }
}

function deleteStudent(id) {
    deleteId = id;

    for (let i = 0; i < students.length; i++) {
        if (students[i].id === id) {
            const s = students[i];
            const fio = s.lastName + ' ' + s.firstName + ' ' + s.middleName;
            document.getElementById('deleteName').textContent = fio;
        }
    }

    document.getElementById('deleteWindow').classList.add('show');
}

document.getElementById('deleteYes').addEventListener('click', function () {
    for (let i = 0; i < students.length; i++) {
        if (students[i].id === deleteId) {
            students[i].active = false;
        }
    }
    document.getElementById('deleteWindow').classList.remove('show');
    deleteId = null;
    showStudents();
});

document.getElementById('deleteNo').addEventListener('click', function () {
    document.getElementById('deleteWindow').classList.remove('show');
    deleteId = null;
});

document.getElementById('deleteClose').addEventListener('click', function () {
    document.getElementById('deleteWindow').classList.remove('show');
    deleteId = null;
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

document.getElementById('sortScore').addEventListener('change', function () {
    activeSort = 'score';
    showStudents();
});

document.getElementById('sortBirth').addEventListener('change', function () {
    activeSort = 'birth';
    showStudents();
});

document.getElementById('showActive').addEventListener('change', showStudents);
document.getElementById('showInactive').addEventListener('change', showStudents);

validateForm();
showStudents();
