const handleSignUpPost=(req,res,bcrypt,database)=>{
	const{name,email,password}=req.body;
	if(!name || !email || !password){
		return res.status(400).json('Incorrect Credentials');
	}
	const hash=bcrypt.hashSync(password);
	database.transaction(trx=>{
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
			.then(user=>{
				res.json(user[0]);
			})
		})
		.then(trx.commit)
		.catch(trx.rollback);
	})
	.catch(err=>res.status(404).json('Sign Up Failed!!!'));
}

module.exports={
	handleSignUpPost:handleSignUpPost
}