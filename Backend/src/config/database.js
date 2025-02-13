const mongoose = require('mongoose');

const connectDB = async () => {
    
    await mongoose.connect('mongodb+srv://shreyjoshi:IwxjXO5Eaf9QArD1@namastenode.rhzs8.mongodb.net/DevTinder');
};

module.exports = connectDB

// connectDB().then(()=>{

//     console.log("Data connection establised successfully.");
    
// }).catch(err => {

//     console.log("Connection to database failed.")
// })