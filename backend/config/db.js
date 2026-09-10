const mongoose = require("mongoose")


async  function  connection(){
     try{

        await mongoose.connect(process.env.MONGO_URL)
        console.log("Conncted to Database")
        
     }catch(err){
        console.log(err)
     }
}

module.exports= connection;