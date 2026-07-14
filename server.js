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

// Start the server
app.listen(5000, () => {console.log("Server running on http://localhost:5000");
});
