require("dotenv").config();
const app = require("./app.js")
const connection = require("./config/db.js")
const { connectRedis } = require("./config/redis.js")
 

connection();
connectRedis();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})