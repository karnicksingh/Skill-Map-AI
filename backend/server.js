require("dotenv").config();
const app = require("./app.js")
const connection = require("./config/db.js")
const { connectRedis } = require("./config/redis.js")
 

connection();
connectRedis();

 

app.listen(3000,()=>{
console.log("Server is running on  3000")
})