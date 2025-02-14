const jwt = require('jsonwebtoken');
const {UserModel} = require("../models/user")


const protect=async (req,res,next)=>{
    const headers = req.headers;
    let token;
    
    if(headers.authorization && headers.authorization.startsWith("Bearer")){
        try{
            

            token=headers.authorization.split(" ")[1]
            const decode=jwt.verify(token,process.env.jwt_secret)
            const userid=decode._id
            const isUser=await UserModel.findOne({_id:userid})
            if(isUser){
                next()
            }else{
                res.status(401).send({message:"No User with this token"})
            }
        }
        catch(error){
            res.status(401).send({message:"Invalid TOKEN"})
        }
        }
 if(!token){
    res.status(401).send({Message:"No Token",headers})
 }       

}


module.exports=protect