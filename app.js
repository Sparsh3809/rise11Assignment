if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const User=require('./models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const secret = process.env.SECRET;
const dbUrl = process.env.DB_URL;
console.log(dbUrl);
const MongoStore  = require('connect-mongo');
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console,"Connection error"));
db.once("open",()=>{
    console.log("Database Connected");
})
const store= MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{secret},
    
    touchAfter:24*60*60
});
store.on("error",function(e){
    console.log("Session Store Error",e)
})
app.use(express.urlencoded({ extended: true }));

app.post('/signup',async(req,res)=>{
    const {email, username, password} = req.body;
    const user = new User({email, username, password});
    await user.save();
})

app.post('/login',async(req,res)=>{
    const {email, password} = req.body;
    const foundUser = await User.findAndValidate(email, password);
    if(foundUser){
        res.send("User Found");
    }
    else {
        res.send("The username or password is incorrect");
    }
    
})

app.listen(3000 , ()=>{
    console.log("Listening on port 3000");
})