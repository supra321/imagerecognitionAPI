const handleRootGet=(res,database)=>{
	database.select('*').from('users').then(users=>{
		res.json(users);
	});
}

module.exports={
	handleRootGet:handleRootGet
}