const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: {
      type : Number,
      // required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    price :{
      type: Number,//Float64Array,
      required: true
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    }
  });

const Product = mongoose.model('Products', productSchema);
module.exports = Product;

  