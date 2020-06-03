const createSessions= require('./login').createSessions;

const validateCredentials=(req,bcrypt,database)=>{
	const{name,email,password}=req.body;
	if(!name || !email || !password){
		return Promise.reject('Incorrect Credentials');
	}
	const hash=bcrypt.hashSync(password);
	return database.transaction(trx=>{
		trx.insert({
			email:email,
			password:hash
		}).into('login').returning('email')
		.then(Email=>{
			return trx('users').returning('*')
			.insert({
				name:name,
				email:Email[0],
				joined: new Date()
			})
			.then(user=>user[0])
			.catch(err=>Promise.reject('Sign Up Failed!!!'));
		})
		.then(trx.commit)
		.catch(trx.rollback);
	})
	.catch(err=>Promise.reject('Sign Up Failed!!!'));
}

const handleSignUpPostAuth=(req,res,bcrypt,database,client)=>{
	return validateCredentials(req,bcrypt,database)
			.then(user=>{
				return user.id && user.name && user.email? createSessions(user,client):
				Promise.reject('Invalid User!!!')
			}).then(session=>res.json(session))
			.catch(err=>res.status(404).json('Invalid Credentials!!!'));
}

module.exports={
	handleSignUpPostAuth:handleSignUpPostAuth
}