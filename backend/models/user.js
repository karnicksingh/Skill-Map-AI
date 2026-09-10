const mongoose = require("mongoose")


const  UserSchema =  new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"username already exist !"],
        require:true  
    },
    email:{
        type:String,
        unique:[true,"Account is Already Exist with this mail !"],
        require:true  
    },
    password:{
        type:String,
        require:true  
    },

})


const userModel = mongoose.model("users",UserSchema);

module.exports=userModel;