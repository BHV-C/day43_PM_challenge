const mongoose = require('mongoose');
const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

const products = require('./databases/models/products');
const route = require('./routes/route');
require('./db');

// Define the path to your static files (images)
const staticPath = path.join(__dirname, "public", "images");
const cssPath = path.join(__dirname, "public", "css");
const views = path.join(__dirname, "views", "views");

// Serve static files (images) with caching headers
app.use(
  "/images",
  express.static(staticPath, {
    maxAge: "1y", // Set the maximum age for caching (1 day in this example)
    etag: true, // Enable ETag for RESTful API
  })
);

// Serve CSS files with caching headers
app.use(
  "/css",
  express.static(cssPath, {
    maxAge: "1y", // Set the maximum age for caching (1 day in this example)
    etag: true, // Enable ETag for RESTful API
  })
);


// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} req.status:${req.statusCode}`);
  next();
});

app.use(express.json());
app.set("view engine", "ejs");
// app.set("views", __dirname+"views");

app.use(route);




// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json(message);
});

const server = app.listen(port, () => {
  console.log(`Server is working on http://127.0.0.1:${port}`);
});
