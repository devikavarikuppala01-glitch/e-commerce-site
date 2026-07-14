// Initialize state variables globally
let products = [];
let cart = [];

document.addEventListener('DOMContentLoaded', function () {
    // 1. Fetch live product data from your active Node.js server
    fetch("http://localhost:5000/api/products")
        .then(response => response.json())
        .then(data => {
            products = data; // Save the fetched list to the global variable
            displayProducts(products); // Render products to the web view
        })
        .catch(error => console.error("Error fetching data:", error));
});

// 2. Render the grid of items fetched from the backend server
function displayProducts(productsToRender) {
    const productList = document.getElementById("productList");
    productList.innerHTML = ""; // Clear out any placeholder content
    
    productsToRender.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.className = "product";
        
        // Dynamically build the item display card with a working button trigger
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}" style="width:100%; max-width:200px; height:auto;">
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        
        productList.appendChild(productDiv);
    });
}

// 3. Add individual selected product elements into cart storage array
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        alert(`${product.name} added to the cart!`);
        viewCart(); // Instantly update user interface drawer list display
    }
}

// 4. Update and structure the layout display list of items within your shopping cart
function viewCart() {
    const cartList = document.getElementById("cartList");
    cartList.innerHTML = ""; // Clear old cart items display
    
    cart.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        
        cartItem.innerHTML = `
            <h3>${item.name}</h3>
            <p>Price: $${item.price}</p>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        
        cartList.appendChild(cartItem);
    });
    
    // Recalculate overall item sum totals inside shopping array elements
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById("totalPrice").textContent = `Total: $${total}`;
}

// 5. Remove matching data entities array index references out from operational records
function removeFromCart(productId) {
    // Keep everything EXCEPT the item matched by ID
    cart = cart.filter(item => item.id !== productId);
    viewCart(); // Re-render the cart list container contents updated fields layout
}
