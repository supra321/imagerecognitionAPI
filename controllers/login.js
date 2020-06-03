const jwt = require('jsonwebtoken');

const checkCredentials=(req,bcrypt,database)=>{
	const{email,password}=req.body;
	if(!email || !password){
		return Promise.reject('Incorrect Credentials');
	}
	return database.select('email','password').from('login')
		.where('email','=',email)
		.then(user=>{
			if(bcrypt.compareSync(password,user[0].password)){
				return database.select('*').from('users')
				.where('email','=',email).then(userData=>userData[0])
				.catch(err=>Promise.reject('Wrong Combination!!!'));
			}
			else{
				Promise.reject('Wrong Combination!!!');
			}
		})
		.catch(err=>Promise.reject('Wrong Combination!!!'));
}

const getAuthTokenId=(res,authorization,client)=>{
	return client.get(authorization,(err,reply)=>{
		if(err || !reply){
			return res.status(401).json('Unauthorized!!!');
		}
		return res.json({id:reply})
	})
}

const setToken=(token,id,client)=>{
	return Promise.resolve(client.set(token,id))
}

const createSessions=(user,client)=>{
	const {id}=user;
	const token=jwt.sign({id},process.env.JWT_SIGNATURE,{expiresIn: 60 * 60 });
	return setToken(token,id,client)
		.then(()=>{
			return {userId:id,token:token}
		})
		.catch(err=>Promise.reject('Unable to set Token!!!'));
}

const handleLogInPostAuth=(req,res,bcrypt,database,client)=>{
	const {authorization}=req.headers;
	return authorization? getAuthTokenId(res,authorization,client):
		checkCredentials(req,bcrypt,database)
		.then(user=>{
			return user.id && user.name && user.email? createSessions(user,client):
			Promise.reject('Incorrect User!!!')
		}).then(session=>res.json(session))
		.catch(err=>res.status(404).json('Incorrect Credentials!!!'))
}

module.exports={
	handleLogInPostAuth:handleLogInPostAuth,
	createSessions:createSessions
}