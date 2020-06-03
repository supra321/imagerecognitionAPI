const handleDeleteToken=(req,res,client)=>{
	const{token}=req.body;
	return client.del(token, (err, response) => {
	   if (response === 1) {
	      return res.status(200).json("Deleted Successfully");
	   } else{
	    return res.status(404).json("Cannot delete!!!")
	   }
	})
}

module.exports={
	handleDeleteToken:handleDeleteToken
}