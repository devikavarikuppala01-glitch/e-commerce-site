// Import necessary modules
const express = require("express");
const cors = require("cors");
const app = express();

// Middleware to parse JSON
app.use(cors());
app.use(express.json());

// Mock data
const products = [
    { id: 1, name: "Laptop", price: 899 , image: "images/laptop.jpg" },
    { id: 2, name: "Headphones", price: 399, image: "images/headphones.jpg" },
    { id: 3, name: "Smartphone", price: 699, image: "images/smartphone.jpg" },
    { id: 4, name: "camera", price: 599, image: "images/camera.jpg" }
];

// API endpoint to fetch products
app.get("/api/products", (req, res) => {
    res.json(products);
});



let cart = []; // Shopping cart array

// Add item to cart
app.post("/api/cart", (req, res) => {
    const product = req.body;
    cart.push(product);
    res.json({ message: "Product added to cart", cart });
});

// Get all cart items
app.get("/api/cart", (req, res) => {
    res.json(cart);
});

// Remove item from cart
app.delete("/api/cart/:id", (req, res) => {
    const id = parseInt(req.params.id);
    cart = cart.filter(item => item.id !== id);
    res.json({ message: "Product removed from cart", cart });
});




app.post("/api/checkout", (req, res) => {
    const { cart, total } = req.body;
    const orderId = Math.floor(Math.random() * 1000); // Simulate order ID generation
    res.json({ message: "Order placed successfully", orderId });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));