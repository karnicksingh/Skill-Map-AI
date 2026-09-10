require("dotenv").config();
const app = require("./backend/app.js")
const connection = require("./backend/config/db.js")
const { connectRedis } = require("./backend/config/redis.js")
connection();
connectRedis();

app.listen(3000,()=>{
console.log("Server is running on  3000")
})