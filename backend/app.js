const express = require('express')


const app = express()


app.use(express.json());
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.routes.js")

app.use("/api/auth",authRouter)



module.exports =app ;