if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const User=require('./models/user');
const mongoose = require('mongoose');
const mailChecker=require('mailchecker');
const bcrypt = require('bcrypt');
const emailCheck=require('email-check');
const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex:true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console,"Connection error"));
db.once("open",()=>{
    console.log("Database Connected");
})
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/signup', (req, res)=>{
    res.render('signup');
});

app.post('/signup',async(req,res)=>{
    const {email, username, password} = req.body;
    if(mailChecker.isValid(email)){
        const user=new User({email,username,password});
        console.log(user);
        await user.save();
        res.send("Successful registration");
    }
    else{
        res.send("Invalid email");
    }
})

app.post('/login',async(req,res)=>{
    const {email, password} = req.body;
    const foundUser = await User.findAndValidate(email, password);
    if(foundUser){
        res.send("User Found");
    }
    else {
        res.send("The Email or Password is incorrect");
    }
    
})

app.listen(8000 , ()=>{
    console.log("Listening on port 8000");
})