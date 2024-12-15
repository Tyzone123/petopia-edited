// Select elements
const searchBar = document.getElementById("search-bar");
const categorySelect = document.getElementById("category-select");
const filterButton = document.getElementById("filter-button");
const productCards = document.querySelectorAll(".product-card");

const cartToggle = document.getElementById("cart-toggle");
const cartSidebar = document.getElementById("cart-sidebar");
const cartItemsContainer = document.getElementById("cart-items");
const totalPriceElement = document.getElementById("total-price");
const clearCartButton = document.getElementById("clear-cart");
const buyCartButton = document.getElementById("buy-cart");
const subscribeButton = document.getElementById("subscribe-button");

// Cart state
let cart = [];

// 1. Filter Products
function filterProducts() {
    const searchQuery = searchBar.value.trim().toLowerCase();
    const selectedCategory = categorySelect.value;

    productCards.forEach(card => {
        const productName = card.querySelector(".product-name")?.textContent.trim().toLowerCase();
        const productCategory = card.dataset.category;

        // Check if the product matches
        const matchesSearch = productName?.includes(searchQuery);
        const matchesCategory = selectedCategory === "all" || productCategory === selectedCategory;

        card.style.display = matchesSearch && matchesCategory ? "block" : "none";
    });
}

// Attach event listeners for filtering
filterButton.addEventListener("click", filterProducts);
searchBar.addEventListener("input", filterProducts);
categorySelect.addEventListener("change", filterProducts);

// 2. Cart Management
function updateTotalPrice() {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalPriceElement.textContent = `P${total}`;
}

function renderCart() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
        return;
    }

    cart.forEach((item, index) => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <p class="cart-item-name">${item.name}</p>
                <p class="cart-item-price">P${item.price}</p>
                <div class="cart-item-quantity">
                    <button class="decrease-quantity" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-quantity" data-index="${index}">+</button>
                </div>
            </div>
            <button class="remove-item" data-index="${index}">&times;</button>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    // Event Listeners for Cart Actions
    document.querySelectorAll(".increase-quantity").forEach(button =>
        button.addEventListener("click", e => {
            const index = parseInt(e.target.getAttribute("data-index"));
            cart[index].quantity += 1;
            updateTotalPrice();
            renderCart();
        })
    );

    document.querySelectorAll(".decrease-quantity").forEach(button =>
        button.addEventListener("click", e => {
            const index = parseInt(e.target.getAttribute("data-index"));
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
                updateTotalPrice();
                renderCart();
            }
        })
    );

    document.querySelectorAll(".remove-item").forEach(button =>
        button.addEventListener("click", e => {
            const index = parseInt(e.target.getAttribute("data-index"));
            cart.splice(index, 1);
            updateTotalPrice();
            renderCart();
        })
    );
}

function addItemToCart(item) {
    const existingItemIndex = cart.findIndex(cartItem => cartItem.name === item.name);
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    updateTotalPrice();
    renderCart();
}

// Cart Buttons
clearCartButton.addEventListener("click", () => {
    cart = [];
    updateTotalPrice();
    renderCart();
});

buyCartButton.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
    } else {
        alert("Thank you for your purchase!");
        cart = [];
        updateTotalPrice();
        renderCart();
    }
});

// Toggle Sidebar
cartToggle.addEventListener("click", () => {
    cartSidebar.classList.toggle("collapsed");
});

// Add Items to Cart
document.querySelectorAll(".buy-button").forEach(button =>
    button.addEventListener("click", e => {
        const productCard = e.target.closest(".product-card");
        const item = {
            name: productCard.querySelector(".product-name").textContent.trim(),
            price: parseFloat(productCard.querySelector(".product-price").textContent.replace("P", "")),
            image: productCard.querySelector(".product-image").src,
        };
        addItemToCart(item);
    })
);

// 3. Subscription Validation
subscribeButton.addEventListener("click", () => {
    const emailInput = document.querySelector("input[aria-label='Email address']");
    const emailValue = emailInput.value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
        alert("Please enter a valid email address.");
    } else {
        alert("Thank you for subscribing!");
        emailInput.value = "";
    }
});
