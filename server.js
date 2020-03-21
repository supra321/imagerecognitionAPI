const express=require('express');
const bodyParser=require('body-parser');
const bcrypt=require('bcrypt-nodejs');
const cors=require('cors');
const knex =require('knex');
const rooot=require('./controllers/rooot');
const login=require('./controllers/login');
const signup=require('./controllers/signup');
const profile=require('./controllers/profile');
const rank=require('./controllers/rank');

const database=knex({
	client:'pg',
	connection:{
	    connectionString:process.env.DATABASE_URL,
  		ssl:true
	}
});

const app=express();

app.use(bodyParser.json());
app.use(cors());

app.get('/',(req,res)=>{rooot.handleRootGet(res,database)})
app.post('/login',(req,res)=>{login.handleLogInPost(req,res,bcrypt,database)})
app.post('/signup',(req,res)=>{signup.handleSignUpPost(req,res,bcrypt,database)})
app.get('/profile/:id',(req,res)=>{profile.handleProfileGet(req,res,database)})
app.put('/rank',(req,res)=>{rank.handleRankPut(req,res,database)})
app.post('/imageurl',(req,res)=>{rank.handleAPICallPost(req,res)})

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log(`App is running on port ${PORT}`);
});