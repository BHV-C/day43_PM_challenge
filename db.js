const mongoose = require('mongoose');
require('dotenv').config();

// const connectDB = async () => { // 
//   try {
    const dbURL = process.env.DATABASE_URI;
    // dbURL.jsonStringify();//'mongodb://127.0.0.1:27017/databases/usersDB.db'; // Replace with your database URL
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

     mongoose.connect(dbURL, options).then( () => {
      console.log('Connected successfully');
    }).catch(err => console.error(err.message));
    
  //   const db = mongoose.connection;

  //   db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  //   db.once('open', () => {
  //     console.log('Connected to MongoDB');
  //   });
  // } catch (error) {
  //   console.error('Error connecting to MongoDB:', error);
  //   process.exit(1); // Exit the application in case of a connection error
//   }
// };

// module.exports = connectDB;
