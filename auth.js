
const express = require('express');
const mongoose = require('mongoose');
const bct= require("bcrypt");
const jwt = require('jsonwebtoken');
const { log } = require('console');


const app = express()
//middleware for data fomatting
app.use(express.json())

//database code
//db connection
mongoose.connect('mongodb://localhost:27017/naresh').
    then(() => console.log('db connected')).catch((err) => console.log(err));

//Schema for database
const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'userName was incorrect']
    },
    userMail: {
        type: String,
        required: true,
        unique: true
    },
    password: { type: String, required: true },
}, { timestamps: true })
//db model 
const userModel = mongoose.model('user', userSchema)


//api developmet coding server side
app.listen(8000, () => console.log('server is running'))

//registration api
app.post('/register', (req, res) => {
    let user = req.body
    bct.genSalt(5, function(err, salt) {
        bct.hash(user.password, salt, function(err, hash) {
           
            if(!err){
                user.password=hash
                userModel.create(user).then
                ((user)=>res.status(201).send(user)).catch((err)=>res.send(err))
            }
        });
    });
    
})

function validUser(req,res,next){
    userCred=req.body
    userModel.findOne({userName:userCred.userName}).then
    ((user)=>{
        if(user!=null){
            bct.compare(userCred.password, user.password, function(err, result) {
                if(result===true){

                     next()
                    
                }
                else{
                    res.status(401).send('password incorrect');
                }
            });
            
        }
        else{
            res.status(404).send('user not found')
        }
    }).catch((err)=>{
        console.log(err);
        res.send({message:"Some Problem"})
    })
}

app.post('/login',validUser,(req,res)=>{
    jwt.sign({userName:userCred.userName},'nareshkey' , function(err, token) {
        if(!err){
            res.send({token:token})
        }
        else{
            res.status(500).send({message:"Some issue while creating the token please try again"})
        }
    })
})


app.get('/users',verifyToken,(req,res)=>{
     userModel.find({}).then((users)=>res.send(users)).catch((err)=>console.log(err))
})

function verifyToken(req,res,next){
      let token=req.headers.authorization.split(' ')[1];  
      jwt.verify(token,'nareshkey',(err,data)=>{
        if(!err){
            console.log(data)
            next()
        }
        else{
            console.log(data);
            res.status(401).send({message:"Invalid Token please login again"})
        }
      })   
}








