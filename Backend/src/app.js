const express = require('express');
const { adminAuth } = require('./middlewares/auth.js');

const app = express(); //creating a new app using Express (a new project basically)

app.get("/admin",adminAuth,(req,res)=>{

    res.send("Hello I am the Admin");
})

app.get("/admin/dashboard", adminAuth, (req,res)=>{
    res.send("Admin Dashboard data.")
})

app.get("/users",(req,res)=> {
    res.send("All data of users.")
})

app.get("/users/user1",(req,res)=> {
    res.send("All data of user 1.")
})

app.listen(3000, ()=> {
    console.log("Server is successfully listening on port 3000");
}); //pass on the port where you want to start the server.