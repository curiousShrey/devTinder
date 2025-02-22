const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("./utils/validation");

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
    try {
      // Validation of data
      validateSignUpData(req);
  
      const { firstName, lastName, emailId, password } = req.body;
  
      // Encrypt the password
      const passwordHash = await bcrypt.hash(password, 10);
      console.log(passwordHash);
  
      //   Creating a new instance of the User model
      const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
      });
  
      const savedUser = await user.save();
      const token = await savedUser.getJWT();
  
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
  
      res.json({ message: "User Added successfully!", data: savedUser });
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  });

app.post('/login', async (req,res) =>{
    const loginData = req.body;
    console.log(loginData.emailId);

    await User.find({emailId: loginData.emailId}).then((user)=>{
        console.log(user);
        res.send("User logged in succesfully.")
    }).catch(err => {
        throw new Error('User not found.')
    })

})