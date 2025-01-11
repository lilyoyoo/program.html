const users = JSON.parse(localStorage.getItem('users')) || {};
let currentUser = null;

const books = [
    "Principles of Marketing",
    "The Sea",
    "The Science Library",
    "Mysteries of Mind Space and Time",
    "The World We Lived In",
    "Discover Science",
    "Integrated Science Philippines 8",
    "Earth Science",
    "Skylab's Astronomy and Space Science"
];

let borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || {};

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
}

function updateBookLists() {
    const availableBooksList = document.getElementById('available-books');
    const borrowedBooksList = document.getElementById('borrowed-books');
    const bookSelect = document.getElementById('book-select');

    availableBooksList.innerHTML = '';
    borrowedBooksList.innerHTML = '';
    bookSelect.innerHTML = '<option value="" disabled selected>Select a book</option>';

    books.forEach(book => {
        if (borrowedBooks[book]) {
            borrowedBooksList.innerHTML += `<li class="borrowed">${book} (Borrowed by ${borrowedBooks[book].user} on ${borrowedBooks[book].time}) <button onclick="returnBook('${book}')">Return</button></li>`;
        } else {
            availableBooksList.innerHTML += `<li>${book}</li>`;
            bookSelect.innerHTML += `<option value="${book}">${book}</option>`;
        }
    });
}

function borrowBook() {
    const selectedBook = document.getElementById('book-select').value;
    if (selectedBook) {
        const borrowTime = new Date().toLocaleString();
        borrowedBooks[selectedBook] = {
            user: currentUser,
            time: borrowTime
        };
        localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
        updateBookLists();
        alert(`You have borrowed "${selectedBook}" at ${borrowTime}`);
    } else {
        alert("Please select a book to borrow!");
    }
}

function returnBook(book) {
    if (borrowedBooks[book] && borrowedBooks[book].user === currentUser) {
        delete borrowedBooks[book];
        localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
        updateBookLists();
        alert(`You have returned "${book}"`);
    } else {
        alert("This book was not borrowed by you!");
    }
}

function register() {
    const username = document.getElementById('username-register').value;
    const password = document.getElementById('password-register').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;

    if (username && password && age && gender) {
        if (users[username]) {
            alert("User already exists!");
        } else {
            users[username] = { password, age, gender };
            localStorage.setItem('users', JSON.stringify(users));
            alert("Registration successful! Please log in.");
            showSection('login-section');
        }
    } else {
        alert("Please fill in all fields.");
    }
}

function login() {
    const username = document.getElementById('username-login').value;
    const password = document.getElementById('password-login').value;

    if (users[username] && users[username].password === password) {
        currentUser = username;
        alert(`Welcome, ${username}!`);
        updateBookLists();
        showSection('borrow-section');
    } else {
        alert("Invalid credentials!");
    }
}

function logout() {
    currentUser = null;
    alert("You have been logged out!");
    showSection('login-section');
}

function exportToExcel() {
    const borrowedBooksData = [];
    Object.keys(borrowedBooks).forEach(book => {
        const borrowDetails = borrowedBooks[book];
        borrowedBooksData.push([book, borrowDetails.user, borrowDetails.time]);
    });

    if (borrowedBooksData.length > 0) {
        const ws = XLSX.utils.aoa_to_sheet([["Book Title", "Borrowed By", "Date & Time"], ...borrowedBooksData]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Borrowed Books");

        XLSX.writeFile(wb, "borrowed_books.xlsx");
    } else {
        alert("No borrowed books to export.");
    }
}

// Initialize the app
updateBookLists();
