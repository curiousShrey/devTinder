const express = require('express');

const app = express(); //creating a new app using Express (a new project basically)

app.use("/test",(req,res)=>{

    res.send("Hello from the server test route!");
})

app.get("/users",(req,res)=> {
    res.send("Got all the response of users.")
})

app.listen(3000, ()=> {
    console.log("Server is successfully listening on port 3000");
}); //pass on the port where you want to start the server.