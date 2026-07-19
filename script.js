// Initialize state variables globally
let products = [];
let cart = [];

document.addEventListener('DOMContentLoaded', function () {
    // 1. Try to fetch live product data from your active Node.js server
    fetch("http://localhost:5000/api/products")
        .then(response => {
            if (!response.ok) {
                throw new Error("Local backend offline");
            }
            return response.json();
        })
        .then(data => {
            products = data; // Save the fetched list to the global variable
            displayProducts(products); // Render products to the web view
            console.log("Loaded products from local backend!");
        })
        .catch(error => {
            console.warn("Backend server not found. Loading backup products instead:", error);
            
            // BACKUP PRODUCTS LIST FOR NETLIFY
            const backupProducts = [
                { 
                    id: 1, 
                    name: "Premium Laptop", 
                    price: 999, 
                    image: "https://images.unsplash.com/photo-1496181130204-755241544e3f?w=500&q=80" 
                },
                { 
                    id: 2, 
                    name: "Wireless Headphones", 
                    price: 449, 
                    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" 
                },
                { 
                    id: 3, 
                    name: "Mechanical Keyboard", 
                    price: 889, 
                    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80" 
                }
            ];
            
            products = backupProducts; // Assign backups to the global array so add to cart works
            displayProducts(products); // Render the backups onto the screen
        });
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
            <img src="${product.image}" alt="${product.name}" style="width:100%; max-width:200px;">
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(productDiv);
    });
}

// 3. Add individual selected product elements into cart storage array on the server
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        fetch("http://localhost:5000/api/cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
        })
        .then(response => response.json())
        .then(() => {
            alert(`${product.name} added to the cart!`);
            fetchCart(); // Instantly update user interface drawer list display
        })
        .catch(error => console.error("Error adding to cart:", error));
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

const cartList = document.getElementById("cartList");

// 5. Fetch cart data from the server
function fetchCart() {
    fetch("http://localhost:5000/api/cart") // Adjust port according to your server settings
        .then(response => response.json())
        .then(data => {
            cart = data; // Update the global cart array with server data
            viewCart(); // Render the updated cart UI and calculate total
        })
        .catch(err => console.error("Error fetching cart:", err));
}

// Remove matching data entities array index references out from operational records
function removeFromCart(id) {
    fetch(`http://localhost:5000/api/cart/${id}`, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(() => {
        fetchCart(); // Refresh cart from server after deletion
    })
    .catch(error => console.error("Error removing from cart:", error));
}

// Initial fetch of the cart on page load
fetchCart();





function calculateTotal() {
    return cart.reduce((total, item) => total + item.price, 0);
}

function checkout() {
    const total = calculateTotal();
    fetch("http://localhost:5000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, total }),
    })
    .then((response) => response.json())
    .then((data) => {alert(`Order placed! Order ID: ${data.orderId}`);
    window.print();
})
    .catch((error) => console.error("Error during checkout:", error));
}



function toggleCart() {
    const cartSidebar = document.getElementById("cartSidebar");
    cartSidebar.style.display = cartSidebar.style.display === "none" ? "block" : "none";
}