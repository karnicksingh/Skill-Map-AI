const userModel = require("../models/user.js")
const {redisClient} = require("../config/redis.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


/** @name registerUserController
 * @description Controller for registering a new user
 * @access Public
 */
async function registerUserController(req,res){
    const {username, email, password}=req.body;

    if( !username || !email || !password){
        return res.status(400).json({
            succes:false,
            message:"Please provide username , email and password"
        })
    }

    const isUserAlreadyExist = await userModel.findOne({
        $or:[{username},{email}]
    })

    if(isUserAlreadyExist){         
        return res.status(400).json({
            message:"Account is already exist with this email and username !"
        })
    }

    const hash = await bcrypt.hash(password,10);

    const user = await  userModel.create({
        username,
        email,
        password:hash
    })

  const token = jwt.sign(
    {id:user._id,username:username},
    process.env.JWT_SECRET_KEY,
    {expiresIn:"1d"}
 )
   res.cookie("token",token)

   res.status(201).json({
    success:true,
    message:"User is created successfully",
    user:{
        id:user._id,
        username:user.username,
        email:user.email    
    }
})

}


/**
 * @name loginUserController
 * @description Controller for logging in a user
 * @access Public
 */

async function loginUserController(req,res){
    const {email,password}=req.body;

    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"Please provide email and password"
        })
    }

    const user = await userModel.findOne({email});
    if(!user){
        return res.status(400).json({
            success:false,
            message:"User is not found with this email"
        })

    }
     isPasswordMatched = await bcrypt.compare(password,user.password);
     if(!isPasswordMatched){
        return res.status(400).json({
            success:false,
            message:"Password is not matched"
        })
     }


    const token = jwt.sign(
    {id:user._id,username:user.username},
    process.env.JWT_SECRET_KEY,
    {expiresIn:"1d"}
 )

   res.cookie("token",token)

   res.status(201).json({
    success:true,
    message:"User logged in successfully",
    user:{
        id:user._id,
        username:user.username,
        email:user.email    
    }})
     
}

/**
 * @name loginwithOtp
 * @name send-otp
 * @name verify-otp
 * @descrption  Controller for logging in a user with OTP
 * @access Public   
 * 
 */
   
async function sendOtp(req,res){
     
    const {email}=req.body;

    if(!email){
        return res.status(400).json({
            success:false,
            message:"Please provide email"
        })
    }

    const user = await userModel.findOne({email});
    if(!user){
        return res.status(400).json({
            success:false,
            message:"User is not found with this email"
        })

    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

   await redisClient.set(`otp:${email}`,otp.toString(),{
    EX:300 // 5 minutes
   })

//    console.log(`OTP for ${email} is ${otp}`)

   res.status(200).json({
    success:true,
    message:"OTP is sent to your email",
    otp:otp
   })
}
/***
 * @name verifyOtp
 * @route post /api/auth/verify-otp
 * @description Verify OTP sent to user email
 * @access   Public
 */

async function verifyOtp(req,res){
    const {email,otp}=req.body;

    if(!email || !otp){
        return res.status(400).json({
            success:false,
            message:"Please provide email and otp"
        })
    }
    const user = await userModel.findOne({email});
    if(!user){
        return res.status(400).json({
            success:false,
            message:"User is not found with this email"
        })

    }

    const storedOtp = await redisClient.get(`otp:${email}`);
    if(!storedOtp){
        return res.status(400).json({
            success:false,
            message:"OTP is expired"
        })
    }

    if(storedOtp !== otp){
        return res.status(400).json({
            success:false,
            message:"OTP is not matched"
        })
    }
    await redisClient.del(`otp:${email}`)

    const token = jwt.sign(
        {id:user._id,username:user.username},
        process.env.JWT_SECRET_KEY,
        {expiresIn:"1d"}
     )
    
       res.cookie("token",token)
    
       res.status(201).json({
        success:true,
        message:"User logged in successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email    
        }})
}


/**
 * @name verification Controller
 *  @description Controller for verifying user token and getting user details
 * @access Private
 */
async function verifyTokenController(req,res){
    const userId = req.user.id;
    const user = await userModel.findById(userId);

    res.status(200).json({ 
        message:"User is verified successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email    
        }
    })
}


/**
 * @route post /api/auth/logout
 * @description Logout user and blacklist the token
 * @access   public
 */
async function logoutUserController(req,res){

    const token = req.cookies.token;
    if(!token){
        return res.status(400).json({
            success:false,
            message:"Token is not found"
        })
    }
    
    await redisClient.set(`blacklist:${token}`,"1",{
        EX:86400 // 1 day
    })  

    res.clearCookie("token")
    res.status(200).json({
        success:true,
        message:"User logged out successfully"
    })

}


module.exports = {registerUserController, loginUserController,sendOtp,verifyOtp,logoutUserController,verifyTokenController};