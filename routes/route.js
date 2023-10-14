const express = require('express');
const route = express.Router();
const Product = require('../databases/models/ProductsModel');
// const products = require('../databases/models/products');
const app = express();
const uuid = require('uuid');
require('../db');

const passport = require('passport');


// route.get('/', async (req, res) => {
//   res.status(200).send("Welcome to the basic server");
//   // Find all users with a specific username
//   try{
//       // res.send('welcome to my basic server');
//       const Products = await Product.find();
//       res.status(200).json(Products);
//     }catch(err){
//       res.status(500).json({ error: 'An error occurred while fetching data.' });
//     }
// });

app.set("view engine", "ejs");
// app.set("/views", __dirname+"/views");

// route.get("/", (req, res, next) => {
//   console.log(Products);
//   // const products = 
//   res.render("home", { products: Products });
// });
route.get('/', async (req, res) => {
  try {
      const products = await Product.find();
      res.render('home', { products });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving products');
  }
});

route.get("/products/:id", async (req, res, next) => {
  try {
    const products = await Product.findOne({id: req.params.id});
    console.log(products);
    res.render('productDetails', { product: products });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving products');
  }
});



// Serve the "Advanced Search" page
route.get('/advanced-search', (req, res) => {
  res.render('advanced-search')
});

// Handle the advanced search query
route.post('/advanced-search', async (req, res) => {
  // res.render('search')

  const { keyword, minPrice, maxPrice } = req.body;

  const query = {};//{name: {$regex: /iphone/i}, price: {$gt: 9000,$lte: 10000}};
  console.log(keyword);
  console.log(minPrice);
  console.log(maxPrice);
  if (keyword) {
      query.name = { $regex: new RegExp(keyword, 'i') };
  }
  

  if (minPrice && maxPrice) {
      query.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };
  } else if (minPrice) {
      query.price = { $gte: parseFloat(minPrice) };
  } else if (maxPrice) {
      query.price = { $lte: parseFloat(maxPrice) };
  }
   
  try {
    console.log(req.body);
    console.log(query);
      const products = await Product.find(query).sort({id:1});//.toArray();
     if (products.length == 0){
       res.send("No products match the specified criteria.")
     }else{
         res.json({ products });
     }
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});

// adding products

route.post("/add", async (req,res)=>{ 

  const {id, name, price, description, image} = req.body;

  const newProduct = new Product({
    id,
    name,
    price,
    description,
    image
  });
  newProduct.save()
  .then((product) => {
    console.log("Product added successfully:", product);
    // res.status(201).json(product);
  })
  .catch((err) => {
    console.error("Error adding product:", err);
    res.status(500).json({ error: 'An error occurred while adding the product.' });
  });
  const products = await Product.find().sort({ id: 1 });
  res.status(201).json(products);

});
route.put("/update/:id", async (req,res)=>{
  Product.findOneAndUpdate({id:req.params.id}, {$set:{name,description,price,image }=req.body})
  .then(function(){
    console.log("Data updated"); // Success
  }).catch(function(error){
      console.log(error); // Failure
  }); // doesn't work
  // console.log(req.body.description);
  // const doc = await Product.findOne({id:req.params.id});
  // doc.description = req.body.description;
  // await doc.save();
  const products = await Product.find().sort({ id: 1 });
  console.log(await Product.find({id:req.params.id}));

  // res.status(200).render('home', {products});
  res.send(products);
});

route.delete("/delete/:id", async (req,res)=> {
  Product.deleteOne({id:req.params.id}).then(function(){
      console.log("Data deleted"); // Success
    }).catch(function(error){
        console.log(error); // Failure
    });
  console.log(await Product.find());
  const products = await Product.find().sort({ id: 1});
  res.send(products);
});

// route.get("/products/search", (req, res, next) => {
//   const searchQuery = req.query.item;
//   const minPrice = req.query.minPrice;
//   const maxPrice = req.query.maxPrice;
//   let filteredProducts = products;

//   if (filteredProducts) {
//     filteredProducts = filteredProducts.filter((product) =>
//       product.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }
//   if (minPrice) {
//     filteredProducts = filteredProducts.filter(
//       (product) => product.price >= minPrice
//     );
//   }
//   if (maxPrice) {
//     filteredProducts = filteredProducts.filter(
//       (product) => product.price <= maxPrice
//     );
//   }
//   res.send(filteredProducts);
// });

// route.get("/products/:id", (req, res, next) => {
//   const productsId = parseInt(req.params.id); // Convert string to integer
//   const matchingElement = products.find((element) => {
//     return element.id === productsId;
//   });
//   if (matchingElement) {
//     let originalPrice = matchingElement.price;
//     let newPrice = originalPrice + originalPrice * 0.2; // Adding 20% to the original price
//     res.render("productDetails", { matchingElement: matchingElement });
//   } else {
//     const error = new Error(`Product with ID ${productId} not found`);
//     error.statusCode = 404;
//     next(error);
//   }
// });

// route.post("/products", (req, res, next) => {
//   const newProduct = req.body;
//   if (!newProduct || !newProduct.name || !newProduct.price) {
//     const error = new Error("Invalid product data. Please provide a valid product name and price.");
//     error.statusCode = 400;
//     next(error);
//   }
//   products.push(newProduct);
//   res.send(products);
// });

// route.put("/products/:id", (req, res, next) => {
//   const productId = parseInt(req.params.id); // Convert the ID parameter to an integer.
//   const productIndex = products.findIndex(
//     (product) => product.id === productId
//   );
//   if (productIndex === -1) {
//     const error = new Error(`Product with ID ${productId} not found. Editing product failed.`);
//     error.statusCode = 404;
//     next(error);
//   }
//   const updatedProduct = req.body; // Assuming the request body contains the updated product data.
//   products[productIndex] = { ...products[productIndex], ...updatedProduct };
//   res.send(products[productIndex]);
// });

// route.delete("/products/:id", (req, res, next) => {
//   const productId = parseInt(req.params.id); // Convert the ID parameter to an integer.
//   const productIndex = products.findIndex(
//     (product) => product.id === productId
//   );
//   if (productIndex === -1) {
//     const error = new Error(`Product with ID ${productId} not found. Deleting product failed.`);
//     error.statusCode = 404;
//     next(error);
//   }
//   products.splice(productIndex, 1);
//   res.send({ message: "Product deleted successfully" });
// });

module.exports = route;