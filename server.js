const express=require('express');
const bodyParser=require('body-parser');
const bcrypt=require('bcrypt-nodejs');
const cors=require('cors');
const knex =require('knex');
const morgan =require('morgan');
const redis = require("redis");

const rooot=require('./controllers/rooot');
const login=require('./controllers/login');
const signup=require('./controllers/signup');
const profile=require('./controllers/profile');
const rank=require('./controllers/rank');
const deletetoken=require('./controllers/deletetoken');
const auth=require('./middleware/authorization');

const database=knex({
	client:'pg',
	connection:{
	    connectionString:process.env.DATABASE_URL,
  		ssl:true
	}
});

const app=express();
const client = redis.createClient(process.env.REDIS_URL);

app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json());

app.get('/',(req,res)=>{rooot.handleRootGet(res,database)})
app.post('/login',(req,res)=>{login.handleLogInPostAuth(req,res,bcrypt,database,client)})
app.post('/signup',(req,res)=>{signup.handleSignUpPostAuth(req,res,bcrypt,database,client)})
app.get('/profile/:id',auth.requireAuth,(req,res)=>{profile.handleProfileGet(req,res,database)})
app.post('/profile/:id',auth.requireAuth,(req,res)=>{profile.handleProfileUpdate(req,res,bcrypt,database)})
app.put('/rank',auth.requireAuth,(req,res)=>{rank.handleRankPut(req,res,database)})
app.post('/imageurl',auth.requireAuth,(req,res)=>{rank.handleAPICallPost(req,res)})
app.delete('/deletetoken',auth.requireAuth,(req,res)=>{deletetoken.handleDeleteToken(req,res,client)})

const PORT=process.env.PORT||3001;
app.listen(PORT,()=>{
    console.log(`App is running on port ${PORT}`);
});