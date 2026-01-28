// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountEl = document.querySelector('.cart-count');
  if (cartCountEl) {
    cartCountEl.textContent = count;
    if (count === 0) {
      cartCountEl.style.display = 'none';
    } else {
      cartCountEl.style.display = 'flex';
    }
  }
}

function addToCart(id, name, price, image) {
  const quantity = parseInt(document.getElementById('quantity')?.value || 1);
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ id, name, price, image, quantity });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showNotification(`${name} added to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  displayCart();
}

function updateQuantity(id, quantity) {
  const item = cart.find(item => item.id === id);
  if (item) {
    item.quantity = Math.max(1, quantity);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
  }
}

function displayCart() {
  const cartItemsEl = document.querySelector('.cart-items');
  const cartSummaryEl = document.querySelector('.cart-summary');

  if (!cartItemsEl) return;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Start shopping to add items to your cart!</p>
        <a href="menu.html" class="btn btn-primary">Browse Menu</a>
      </div>
    `;
    if (cartSummaryEl) cartSummaryEl.style.display = 'none';
  } else {
    cartItemsEl.innerHTML = cart
      .map(
        item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        </div>
        <div class="quantity-selector">
          <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})">−</button>
          <input type="number" value="${item.quantity}" readonly />
          <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">✕</button>
      </div>
    `
      )
      .join('');

    if (cartSummaryEl) {
      const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const tax = subtotal * 0.1;
      const total = subtotal + tax;

      cartSummaryEl.innerHTML = `
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
          <span>Tax (10%):</span>
          <span>$${tax.toFixed(2)}</span>
        </div>
        <div class="summary-row summary-total">
          <span>Total:</span>
          <span>$${total.toFixed(2)}</span>
        </div>
        <a href="checkout.html" class="btn btn-primary" style="width: 100%; margin-top: 1.5rem;">Proceed to Checkout</a>
      `;
      cartSummaryEl.style.display = 'block';
    }
  }
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #FF91BC 0%, #FFB6D9 100%);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 50px;
    box-shadow: 0 4px 15px rgba(255, 145, 188, 0.4);
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Accordion functionality
function toggleAccordion(element) {
  const allItems = document.querySelectorAll('.accordion-item');
  allItems.forEach(item => {
    if (item !== element) {
      item.classList.remove('active');
    }
  });
  element.classList.toggle('active');
}

// Form validation
function validateForm() {
  const inputs = document.querySelectorAll('input[required], textarea[required]');
  let isValid = true;

  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = '#FF6B6B';
      isValid = false;
    } else {
      input.style.borderColor = '#E8E8E8';
    }
  });

  return isValid;
}

function handleCheckout(e) {
  e.preventDefault();

  if (!validateForm()) {
    showNotification('Please fill in all required fields');
    return;
  }

  localStorage.removeItem('cart');
  cart = [];
  updateCartCount();
  window.location.href = 'order-success.html';
}

function handleContactForm(e) {
  e.preventDefault();
  if (validateForm()) {
    showNotification('Message sent successfully!');
    e.target.reset();
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  // Setup checkout form
  const checkoutForm = document.querySelector('form[method="POST"]');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckout);
  }

  // Setup contact form
  const contactForm = document.querySelector('form.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm);
  }

  // Setup accordion
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      toggleAccordion(header.parentElement);
    });
  });

  // Display cart if on cart page
  if (window.location.pathname.includes('cart.html')) {
    displayCart();
  }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
