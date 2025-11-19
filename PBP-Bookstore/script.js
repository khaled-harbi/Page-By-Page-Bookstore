// Sample JavaScript to manage cart
class Book {
    constructor(title, price, author, imageUrl) {
        this.title = title;
        this.price = price;
        this.author = author;
        this.imageUrl = imageUrl;
    }
}

class Cart {
    constructor() {
        this.items = [];  // Array to hold the items in the cart
    }

    addBook(book) {
        this.items.push(book);    // Add the book to the cart
        this.saveCart(); 
        this.displayCart();      // Update the cart display
        // Show the checkout button if there are items in the cart   
        if (this.items.length > 0) {
        document.getElementById('checkout-button').style.display = 'block';
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));  // Save cart to localStorage
    }

    displayCart() {
        const cartItemsContainer = document.getElementById('cart-items');
        cartItemsContainer.innerHTML = '';  // Clear existing content

        if (this.items.length > 0) {
            let cartHTML = '<ul class="list-group">';
            this.items.forEach((item, index) => {
                cartHTML += `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <div class="cart-item-info d-flex align-items-center">
                            <img src="${item.imageUrl}" alt="${item.title}" class="cart-item-image" />
                            <div class="ms-3">
                                <strong>${item.title}</strong> - $${item.price}
                            </div>
                        </div>
                        <button onclick="removeFromCart(${index})" class="btn btn-danger btn-sm">Remove</button>
                    </li>`;
            });
            cartHTML += '</ul>';
            cartItemsContainer.innerHTML = cartHTML;  // Display cart items
        } else {
            cartItemsContainer.innerHTML = '<p>No items in cart yet.</p>';  // No items message
        }
    // Event listener for checkout button
    document.getElementById('checkout-button').addEventListener('click', function() {
    window.location.href = 'checkout.html';
});
    }
}

const myCart = new Cart();  // Create a new cart instance

// Function to add a book to the cart
function addToCart(title, price, author, imageUrl) {
    const book = new Book(title, price, author, imageUrl);  // Create a new book object
    myCart.addBook(book);  // Add the book to the cart
    
// Scroll to the cart section after adding the book
       const cartSection = document.getElementById('cart');
       cartSection.scrollIntoView({ behavior: 'smooth' });  // Smooth scroll to cart
   
// Show checkout button if there are items in the cart
       if (cart.length > 0) {
        document.getElementById('checkout-button').style.display = 'block';
    }
}

// Function to remove a book from the cart
function removeFromCart(index) {
    myCart.items.splice(index, 1);  // Remove the book from the cart
    myCart.displayCart();  // Update the cart display
}

// Fetch books from the backend and display them
async function fetchBooks() {
    try {
        const response = await fetch('http://localhost:5000/api/books');  // Fetch books from the API
        const books = await response.json();  // Parse the JSON response
        displayBooks(books);  // Display the books on the frontend
    } catch (error) {
        console.error('Error fetching books:', error);  // Log any errors
    }
}

// Display books on the front page
function displayBooks(books) {
    const booksContainer = document.getElementById('books-container');
    booksContainer.innerHTML = '';  // Clear existing content

    // Check if books are fetched
    if (books.length === 0) {
        booksContainer.innerHTML = '<p>No books available.</p>';  // No books message
        return;  // Exit if no books are available
    }

    books.forEach(book => {

        const descriptionLengthLimit = 100;  // Limit to 100 characters initially
        let shortDescription = book.description;

        if (book.description.length > descriptionLengthLimit) {
            shortDescription = book.description.substring(0, descriptionLengthLimit) + '...';
        }

        const bookCard = `
            <div class="col-md-4 d-flex">
                <div class="card mb-4 w-100 d-flex flex-column">
                    <img src="${book.imageUrl}" class="card-img-top" alt="${book.title}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-author"><strong>Author:</strong> ${book.author}</p>
                        <p class="card-price"><strong>Price:</strong> $${book.price}</p>
                         <p class="card-text">
                            <span class="book-description-short">${shortDescription}</span>
                            <span class="book-description-full" style="display: none;">${book.description}</span>
                            ${book.description.length > descriptionLengthLimit ? `<button class="btn-see-more-description btn btn-link">See More</button>` : ''}
                        </p>
                        <button class="btn btn-primary" onclick="addToCart('${book.title}', ${book.price}, '${book.author}', '${book.imageUrl}')">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
        booksContainer.innerHTML += bookCard;  // Add the book card to the container
    });
    addSeeMoreListeners(); // Add functionality for the "See More" button
}

function addSeeMoreListeners() {
    const seeMoreDescriptionButtons = document.querySelectorAll('.btn-see-more-description');
    
    seeMoreDescriptionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const descriptionElement = this.closest('.card-text');
            const shortDescription = descriptionElement.querySelector('.book-description-short');
            const fullDescription = descriptionElement.querySelector('.book-description-full');
            
            if (shortDescription.style.display === 'none') {
                shortDescription.style.display = 'inline';
                fullDescription.style.display = 'none';
                this.textContent = 'See More';
            } else {
                shortDescription.style.display = 'none';
                fullDescription.style.display = 'inline';
                this.textContent = 'See Less';
            }
        });
    });
}

// Function to filter books by category
async function filterBooks(category) {
    try {
        const response = await fetch(`http://localhost:5000/api/books?category=${category}`);
        const books = await response.json();
        displayBooks(books);
    } catch (error) {
        console.error('Error fetching books by category:', error);
    }
}

// Call fetchBooks when the page loads
document.addEventListener('DOMContentLoaded', fetchBooks);


// Function to handle sign up
document.getElementById('sign-up-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('sign-up-name').value;
    const email = document.getElementById('sign-up-email').value;
    const password = document.getElementById('sign-up-password').value;

    let role = 'user'; // Default role is user
    if (email.endsWith('@adminPBP.com')) {
        role = 'admin'; // Assign admin role if email domain matches
    }

    try {
        const response = await fetch('http://localhost:5000/api/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, role }),
        });

        if (response.ok) {
            alert('Sign Up Successful!');
            closeModal('signUpModal');
        } else {
            alert('Sign Up Failed');
        }
    } catch (error) {
        console.error('Error signing up:', error);
    }
});

// Function to handle sign in
document.getElementById('sign-in-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('sign-in-email').value;
    const password = document.getElementById('sign-in-password').value;

    try {
        const response = await fetch('http://localhost:5000/api/users/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const user = await response.json();
            document.getElementById('user-link').textContent = user.name;
            document.getElementById('signup-link').textContent = "Log Out"; // Update Sign Up to Log Out
            document.getElementById('signup-link').onclick = logout; // Set the logout function on click
            localStorage.setItem('user', JSON.stringify(user)); // Store user in localStorage

            if (user.role === 'admin') {
                showAdminFeatures();  // Show admin panel if the user is an admin
            }

            closeModal('signInModal');
        } else {
            alert('Sign In Failed');
        }
    } catch (error) {
        console.error('Error signing in:', error);
    }
});

// Function to show admin features
function showAdminFeatures() {
    const adminLink = document.createElement('a');
    adminLink.className = 'nav-link';
    adminLink.href = 'admin.html';
    adminLink.textContent = 'Admin Panel';
    document.querySelector('.navbar-nav').appendChild(adminLink);
}

// Function to log out
function logout() {
    localStorage.removeItem('user'); // Clear user from storage
    document.getElementById('user-link').textContent = 'Sign In';
    document.getElementById('user-link').onclick = openSignInModal; // Set Sign In modal for login
    document.getElementById('signup-link').textContent = 'Sign Up'; // Change Log Out back to Sign Up
    document.getElementById('signup-link').onclick = openSignUpModal; // Set Sign Up modal for registration
    const adminLink = document.querySelector('.nav-link[href="/admin"]');
    if (adminLink) {
        adminLink.remove();  // Remove the Admin Panel link if it exists
    }
}

// Function to check if user is logged in on page load
function checkLoggedInUser() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('user-link').textContent = user.name;
        document.getElementById('signup-link').textContent = 'Log Out'; // Set Log Out in the navbar
        document.getElementById('signup-link').onclick = logout; // Set the logout function

        if (user.role === 'admin') {
            showAdminFeatures();  // Show admin features if the user is an admin
        }
    }
}

// Call checkLoggedInUser when the page loads
document.addEventListener('DOMContentLoaded', checkLoggedInUser);

// Function to open the Sign Up modal
function openSignUpModal() {
    document.getElementById('signUpModal').style.display = 'block';
}

// Function to open the Sign In modal
function openSignInModal() {
    document.getElementById('signInModal').style.display = 'block';
}

// Function to close modals
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}