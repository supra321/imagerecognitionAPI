const requireAuth=(req,res,next,client)=>{
	const {authorization}=req.headers;
	if(!authorization){
		return res.status(401).json('Unauthorized Request!!!');
	}
	return client.get(authorization,(err,reply)=>{
		if(err || !reply){
			return res.status(401).json('Unauthorized!!!');
		}
		return next();
	})
}

module.exports={
	requireAuth:requireAuth
}