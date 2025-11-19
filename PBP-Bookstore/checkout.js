function displayCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];  // Get cart items from localStorage
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    // Clear any existing items in the list
    cartItemsList.innerHTML = '';
    
    if (cartItems.length === 0) {
        cartItemsList.innerHTML = '<li>Your cart is empty.</li>';
        cartTotalElement.textContent = '';
        return;
    }

    let total = 0;

    // Loop through each cart item and display it with the cover image
    cartItems.forEach(item => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div class="cart-item">
                <img src="${item.imageUrl}" alt="${item.title}" class="cart-item-image" />
                <div class="cart-item-details">
                    <strong>${item.title}</strong> - ${item.price} $
                </div>
            </div>
        `;
        cartItemsList.appendChild(listItem);
        
        // Calculate total price
        total += item.price;
    });
    
    // Update the total price in the DOM
    cartTotalElement.textContent = `Total: ${total.toFixed(2)} $`;
}

displayCartItems();


// Function to generate a random order number
function generateOrderNumber() {
    return Math.floor(Math.random() * 1000000);  // Generates a random number between 0 and 999999
}

// Handle form submission
document.getElementById('checkout-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the form from submitting normally

    // Generate a random order number
    const orderNumber = generateOrderNumber();

    // Hide the form and show the success message
    document.getElementById('checkout-form').style.display = 'none';
    document.getElementById('order-success').style.display = 'block';
    
    // Set the order number in the success message
    document.getElementById('order-number').textContent = orderNumber;
});
