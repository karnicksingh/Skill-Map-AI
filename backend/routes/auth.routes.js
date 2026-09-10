 const {Router}= require("express");
 const {registerUserController,loginUserController,sendOtp,verifyOtp,logoutUserController,verifyTokenController}= require("../controllers/auth.controller.js")
 const {verifyToken}= require("../middleware/auth.middleware.js")
 const authRouter = Router()

/**
 *  @route post /api/auth/register
 * @description Register new user
 * @access   Public
 */
authRouter.post("/register", registerUserController)

/**
 * @route post /api/auth/login
 * @description Login user
 * @access   Public
 */
authRouter.post("/login", loginUserController)

/***
 * @route post /api/auth/send-otp
 * @description Send OTP to user email
 * @access   Public
 */
authRouter.post("/send-otp", sendOtp)

/**
 * @route post /api/auth/verify-otp
 * @description Verify OTP sent to user email
 * @access   Public
 */
authRouter.post("/verify-otp", verifyOtp)

/**
 * @name get-user   
 * @description Get user details from token 
 * @access   Private
 */
authRouter.get("/get-user", verifyToken , verifyTokenController);



/**
 * @route post /api/auth/logout
 * @description Logout user and blacklist the token
 * @access   Public
 */
authRouter.post("/logout",logoutUserController)

 module.exports= authRouter;