const Clarifai=require('clarifai');

const app = new Clarifai.App({
 apiKey: process.env.API_CLARIFAI
});

const handleAPICallPost=(req,res)=>{
	app.models.predict(Clarifai.TRAVEL_MODEL,req.body.imageInput)
	.then(data=>{
		res.json(data);
	})
	.catch(err=>res.status(400).json('Clarifai API failure. Check Network Connection!!!'));
}

const handleRankPut=(req,res,database)=>{
	const{id}=req.body;
	database('users').where('id','=',id)
  	.increment('rank',1).returning('rank')
  	.then(rank=>{
  		res.json(rank[0]);
  	}).catch(err=>{
  		res.status(404).json('Rank Not Found!!!');
  	})
}

module.exports={
	handleRankPut:handleRankPut,
	handleAPICallPost:handleAPICallPost
}