const handleLogInPost=(req,res,bcrypt,database)=>{
	const{email,password}=req.body;
	database.select('email','password').from('login')
	.where('email','=',email)
	.then(user=>{
		if(bcrypt.compareSync(password,user[0].password)){
			return database.select('*').from('users')
			.where('email','=',email).then(userData=>{
				res.json(userData[0]);
			})
			.catch(err=>res.status(404).json('Wrong Combination!!!'));
		}
		else{
			res.status(404).json('Wrong Combination!!!');
		}
	})
	.catch(err=>res.status(404).json('Wrong Combination!!!'));
}

module.exports={
	handleLogInPost:handleLogInPost
}