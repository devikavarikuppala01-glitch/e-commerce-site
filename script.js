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
                    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500"  
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
        // 1. Try to send it to the backend server first
        fetch("http://localhost:5000/api/cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
        })
        .then(response => {
            if (!response.ok) throw new Error("Backend offline");
            return response.json();
        })
        .then(() => {
            alert(`${product.name} added to the cart!`);
            fetchCart(); // Update user interface
        })
        .catch(error => {
            console.warn("Backend offline. Saving to browser LocalStorage instead.", error);
            
            // BACKUP CART LOGIC FOR NETLIFY:
            let localCart = JSON.getItem("netlify_cart") ? JSON.parse(localStorage.getItem("netlify_cart")) : [];
            localCart.push(product);
            localStorage.setItem("netlify_cart", JSON.stringify(localCart));
            
            alert(`${product.name} added to the cart! (Demo Mode)`);
            
            // Manually update the global cart array and trigger the view update
            cart = localCart;
            viewCart(); 
        });
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
    fetch("http://localhost:5000/api/cart")
        .then(response => {
            if (!response.ok) throw new Error("Backend offline");
            return response.json();
        })
        .then(data => {
            cart = data; // Update global cart array with server data
            viewCart(); // Render updated cart UI
        })
        .catch(error => {
            console.warn("Backend offline. Fetching cart from browser memory.", error);
            
            // BACKUP CART LOAD FOR NETLIFY:
            cart = localStorage.getItem("netlify_cart") ? JSON.parse(localStorage.getItem("netlify_cart")) : [];
            viewCart(); 
        });
}

// Remove matching data entities array index references out from operational records
function removeFromCart(id) {
    fetch(`http://localhost:5000/api/cart/${id}`, {
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) throw new Error("Backend offline");
        return response.json();
    })
    .then(() => {
        fetchCart(); // Refresh from server
    })
    .catch(error => {
        console.warn("Backend offline. Removing item from browser memory.", error);
        
        // BACKUP CART REMOVE FOR NETLIFY:
        let localCart = localStorage.getItem("netlify_cart") ? JSON.parse(localStorage.getItem("netlify_cart")) : [];
        // Remove just the first instance matching the ID
        const index = localCart.findIndex(item => item.id === id);
        if (index !== -1) {
            localCart.splice(index, 1);
        }
        localStorage.setItem("netlify_cart", JSON.stringify(localCart));
        
        cart = localCart;
        viewCart();
    });
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
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ cart, total })
    })
    .then(response => {
        if (!response.ok) throw new Error("Backend offline");
        return response.json();
    })
    .then(data => {
        alert(`Order placed! Order ID: ${data.orderId}`);
        window.print();
    })
    .catch(error => {
        console.warn("Backend offline. Simulating checkout.", error);
        
        // BACKUP CHECKOUT FOR NETLIFY:
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        
        const mockOrderId = "NETLIFY-" + Math.floor(Math.random() * 900000 + 100000);
        alert(`Order placed successfully! (Demo Mode)\nOrder ID: ${mockOrderId}\nTotal Paid: $${total}`);
        
        // Clear browser cart after successful checkout
        localStorage.removeItem("netlify_cart");
        cart = [];
        viewCart();
        
        window.print();
    });
}




function toggleCart() {
    const cartSidebar = document.getElementById("cartSidebar");
    cartSidebar.style.display = cartSidebar.style.display === "none" ? "block" : "none";
}