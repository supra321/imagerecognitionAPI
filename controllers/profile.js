const handleProfileGet=(req,res,database)=>{
	const{id}=req.params;
	database.select('*').from('users').where({
		id:id
	}).then(user=>{
		if(user.length){
			res.json(user[0]);
		}
		else{
			res.status(404).json('Profile Not Found!!!');
		}
	});
}

const handleProfileUpdate=(req,res,bcrypt,database)=>{
	const{id}=req.params;
	const{name,email,password}=req.body.formInput;
	if (password === ''){
		database.transaction(trx=>{
			trx.select('email').from('users').where({
				id:id
			})
			.then(Email=>{
				return trx.select('email').from('login').where({
					email:Email[0].email
				})
				.update({
					email:email,
				})
				.then(resp=>{
					return trx.select('*').from('users').where({
						id:id
					}).update({
						name:name,
						email:email
					})
					.then(resp=>res.json('Profile Update Success'))
					.catch(err=>res.status(404).json('Profile Unable of Update!!!'));
				})
				.catch(err=>res.status(404).json('Email Unable of Update!!!'));
			})
			.then(trx.commit)
			.catch(trx.rollback);
		})
		.catch(err=>res.status(404).json('Profile or Email Unable of Update!!!'));
	}else{
		const hash=bcrypt.hashSync(password);
		database.transaction(trx=>{
			trx.select('email').from('users').where({
				id:id
			})
			.then(Email=>{
				return trx.select('email').from('login').where({
					email:Email[0].email
				})
				.update({
					email:email,
					password:hash
				})
				.then(resp=>{
					return trx.select('*').from('users').where({
						id:id
					}).update({
						name:name,
						email:email
					})
					.then(resp=>res.json('Profile Update Success'))
					.catch(err=>res.status(404).json('Profile Unable of Update!!!'));
				})
				.catch(err=>res.status(404).json('Email Unable of Update!!!'));
			})
			.then(trx.commit)
			.catch(trx.rollback);
		})
		.catch(err=>res.status(404).json('Profile or Email Unable of Update!!!'));
	}
}

module.exports={
	handleProfileGet:handleProfileGet,
	handleProfileUpdate:handleProfileUpdate
}