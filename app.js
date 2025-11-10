// Password visibility toggle functions
function togglePasswordVisibility() {
    const passwordField = document.getElementById('password');
    const toggleIcon = document.querySelector('.password-toggle i');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    } else {
        passwordField.type = 'password';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    }
}

function togglePasswordVisibilityConfirm() {
    const confirmPasswordField = document.getElementById('confirmPassword');
    const toggleIcon = confirmPasswordField.nextElementSibling.querySelector('i');
    if (confirmPasswordField.type === 'password') {
        confirmPasswordField.type = 'text';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    } else {
        confirmPasswordField.type = 'password';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    }
}

// Validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    // At least 8 characters, one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
}

function validateForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    let isValid = true;
    let errors = [];

    if (!name) {
        errors.push('Name is required.');
        isValid = false;
    }

    if (!validateEmail(email)) {
        errors.push('Please enter a valid email address.');
        isValid = false;
    }

    if (!validatePassword(password)) {
        errors.push('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.');
        isValid = false;
    }

    if (password !== confirmPassword) {
        errors.push('Passwords do not match.');
        isValid = false;
    }

    // Display errors
    const errorContainer = document.getElementById('errorMessages');
    if (errorContainer) {
        errorContainer.innerHTML = errors.join('<br>');
        errorContainer.style.display = errors.length > 0 ? 'block' : 'none';
    }

    return isValid;
}

// Form submit handler
document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    if (validateForm()) {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Store in localStorage
        const userData = { name, email, password };
        localStorage.setItem('userData', JSON.stringify(userData));

        // Show success message
        alert('Sign up successful! Data stored in localStorage.');
        // Optionally, redirect or reset form
        // document.getElementById('signupForm').reset();
    }
});

jQuery(document).ready(function()
{
jQuery('.main-text').addClass('active');
setTimeout(function(){ jQuery('.main-text').removeClass('active'); }, 8000);
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productName, price, imageSrc) {
    const product = {
        name: productName,
        price: parseFloat(price.replace('Rs. ', '').replace(',', '')),
        image: imageSrc,
        quantity: 1
    };

    const existingProduct = cart.find(item => item.name === productName);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${productName} added to cart!`);
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'inline' : 'none';
    }
}

function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    if (cartItems && cartTotal) {
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" width="50">
                <div>
                    <h6>${item.name}</h6>
                    <p>Rs. ${item.price} x ${item.quantity} = Rs. ${itemTotal}</p>
                </div>
                <button onclick="removeFromCart(${index})">Remove</button>
            `;
            cartItems.appendChild(cartItem);
        });

        cartTotal.textContent = `Total: Rs. ${total}`;
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();

    // Add data attributes to "Add to Cart" links dynamically
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const addToCartLink = card.querySelector('a[title="Add to Cart"]');
        if (addToCartLink) {
            const productName = card.querySelector('.card-title').textContent.trim();
            const price = card.querySelector('.card-text-price').textContent.trim();
            const imgContainer = card.querySelector('.card-img-container');
            const imageClass = Array.from(imgContainer.classList).find(cls => cls.startsWith('card-'));
            const imageSrc = `../imgaes/${imageClass}.jpg`; // Assuming images are named like card-1.jpg, etc.

            addToCartLink.classList.add('add-to-cart');
            addToCartLink.setAttribute('data-name', productName);
            addToCartLink.setAttribute('data-price', price);
            addToCartLink.setAttribute('data-image', imageSrc);
        }
    });

    // Add event listeners to all "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productName = this.getAttribute('data-name');
            const price = this.getAttribute('data-price');
            const imageSrc = this.getAttribute('data-image');
            addToCart(productName, price, imageSrc);
        });
    });

    // Display cart when modal is shown
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.addEventListener('show.bs.modal', function() {
            displayCart();
        });
    }
});




