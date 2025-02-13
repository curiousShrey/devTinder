const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');

const app = express(); // creating a new app using Express (a new project basically)

app.use(express.json()); // middleware provided by express to convert incoming request STREAM Object into JSON

//Connect to the DB and then start listening to the server.
connectDB().then(()=>{

    app.listen(3000, ()=> {
        console.log("Server is successfully listening on port 3000");
    });

    console.log("Data connection establised successfully.");
    
}).catch(err => {

    console.log("Connection to database failed.")
})
//pass on the port where you want to start the server.


app.post('/signup', async (req,res)=>{

    const userObj = req.body;

    const user = new User(userObj);

    await user.save().then(()=>{

        res.send("User added successfully!")
        
    }).catch(err => {
        console.log(err);
        res.status(400).send("User not added.")
    });

   
})