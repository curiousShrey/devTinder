const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const bcrypt = require("bcrypt");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const { validateSignUpData } = require("./utils/validation");
const { userAuth } = require('./middlewares/auth');

const app = express(); // creating a new app using Express (a new project basically)

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));
app.use(express.json());
app.use(cookieParser()); 

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
    //  console.log(passwordHash);
  
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
    try {
      const { emailId, password } = req.body;
  
      const user = await User.findOne({ emailId: emailId });
      if (!user) {
        throw new Error("Email ID not registered.");
      }
      const isPasswordValid = await user.validatePassword(password);
  
      if (isPasswordValid) {
        const token = await user.getJWT();
  
        res.cookie("token", token, {
          expires: new Date(Date.now() + 8 * 3600000),
        });
        res.send(user);
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  });

app.post('/logout', async (req,res)=>{
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.send("Logout Successful!!");
  });

app.get("/profile/view", userAuth, async (req, res) => {
    try {
      const user = req.user;
  
      res.send(user);
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  });
