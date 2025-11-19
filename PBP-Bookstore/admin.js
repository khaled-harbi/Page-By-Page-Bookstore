// Go back to home page when the button is clicked
document.getElementById('admin-go-home-button').addEventListener('click', function() {
    window.location.href = 'index.html';
});

// Function to edit and save a book
async function saveBook(bookId) {
    const bookItem = document.getElementById(`book-${bookId}`);

    const title = bookItem.querySelector('.book-title').value;
    const author = bookItem.querySelector('.book-author').value;
    const price = bookItem.querySelector('.book-price').value;
    const category = bookItem.querySelector('.book-category').value;
    const description = bookItem.querySelector('.book-description').value;
    const imageUrl = bookItem.querySelector('.book-imageUrl').value;
    const quantity = bookItem.querySelector('.book-quantity').value;

    try {
        const response = await fetch(`http://localhost:5000/api/books/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, author, price, category, description, imageUrl, quantity }),
        });

        if (response.ok) {
            alert('Book updated successfully!');
            fetchBooks();  // Refresh the list of books
        } else {
            alert('Failed to update book.');
        }
    } catch (error) {
        console.error('Error updating book:', error);
    }
}

// Function to fetch books and make them editable
async function fetchBooks() {
    try {
        const response = await fetch('http://localhost:5000/api/books');
        const books = await response.json();

        const bookList = document.getElementById('admin-book-list');
        bookList.innerHTML = '';  // Clear existing books

        books.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.id = `book-${book._id}`;
            bookItem.classList.add('admin-book-item'); // Add a class for styling
            bookItem.innerHTML = `
                <h3><input class="book-title form-control admin-book-title" type="text" value="${book.title}"></h3>
                <p><strong>Author:</strong> <input class="book-author form-control admin-book-author" type="text" value="${book.author}"></p>
                <p><strong>Price:</strong> <input class="book-price form-control admin-book-price" type="number" value="${book.price}"></p>
                <p><strong>Category:</strong> <input class="book-category form-control admin-book-category" type="text" value="${book.category}"></p>
                <p><strong>Description:</strong> <textarea class="book-description form-control admin-book-description">${book.description || ''}</textarea></p>
                <p><strong>Quantity:</strong> <input class="book-quantity form-control admin-book-quantity" type="number" value="${book.quantity}"></p>
                <p><strong>Image URL:</strong> <input class="book-imageUrl form-control admin-book-imageUrl" type="text" value="${book.imageUrl}"></p>
                <img src="${book.imageUrl}" alt="${book.title}" style="width: 100px; height: 150px;">
                <br>
                <button class="btn btn-danger admin-remove-btn" onclick="removeBook('${book._id}')">Remove</button>
                <button class="btn btn-primary admin-save-btn" onclick="saveBook('${book._id}')">Save</button>
                <hr>
            `;
            bookList.appendChild(bookItem);
        });
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}


// Function to delete a book
async function removeBook(bookId) {
    const confirmDelete = confirm("Are you sure you want to delete this book?");
    if (!confirmDelete) return;

    try {
        const response = await fetch(`http://localhost:5000/api/books/${bookId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Book removed successfully!');
            fetchBooks();  // Refresh the list of books
        } else {
            alert('Failed to remove book.');
        }
    } catch (error) {
        console.error('Error removing book:', error);
    }
}

// Fetch books when the page loads
document.addEventListener('DOMContentLoaded', fetchBooks);


// Function to add a new book
async function addBook() {
    // Capture the form data using the correct IDs
    const title = document.getElementById('admin-title').value;
    const author = document.getElementById('admin-author').value;
    const price = document.getElementById('admin-price').value;
    const category = document.getElementById('admin-category').value;
    const description = document.getElementById('admin-description').value;
    const imageUrl = document.getElementById('admin-imageUrl').value;
    const quantity = document.getElementById('admin-quantity').value;

    // Basic validation to ensure required fields are filled
    if (!title || !author || !price || !category) {
        alert('Please fill in all required fields (Title, Author, Price, Category)');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, author, price, category, description, imageUrl, quantity }),
        });

        if (response.ok) {
            alert('Book added successfully!');
            // Optionally, refresh the book list
            fetchBooks();
            // Clear the form fields after success
            document.getElementById('admin-title').value = '';
            document.getElementById('admin-author').value = '';
            document.getElementById('admin-price').value = '';
            document.getElementById('admin-category').value = '';
            document.getElementById('admin-description').value = '';
            document.getElementById('admin-imageUrl').value = '';
            document.getElementById('admin-quantity').value = '';
        } else {
            alert('Failed to add book. Please try again.');
        }
    } catch (error) {
        console.error('Error adding book:', error);
    }
}

// Attach the addBook function to the form submission event
document.getElementById('admin-add-book-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the default form submission
    addBook();  // Call the addBook function
});
