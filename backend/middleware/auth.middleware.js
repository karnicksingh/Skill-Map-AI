const jwt = require("jsonwebtoken");
const {redisClient} = require("../config/redis.js")

async function verifyToken(req,res,next){
  
    const token= req.cookies.token;

    if(!token){
        return res.status(401).json({
            success:false,
            message:"Unauthorized access"
        })
    }

    const isBlacklisted = await redisClient.get(`blacklist:${token}`);
    if(isBlacklisted){
        return res.status(401).json({
            success:false,
            message:"Token is blacklisted"
        })
    }


    try{
         const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);

         req.user = decoded;
         next();
    }catch(err){
        return res.status(401).json({
            success:false,
            message:"Invalid token"
        })
    }

}

module.exports = {verifyToken};