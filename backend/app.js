const express = require('express')
const cookieParser = require("cookie-parser");
const cors = require("cors")
const app = express()

const isProd = process.env.NODE_ENV === "production";

app.use(express.json());
app.use(cookieParser());
const allowedOrigins = ["https://skill-map-ai.in", "https://www.skill-map-ai.in"];
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}))

// Make cookie config available app-wide
app.locals.cookieOptions = {
    httpOnly: true,
    secure: isProd,           // true in production (HTTPS only)
    sameSite: isProd ? "None" : "Lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day in ms
};

const authRouter = require("./routes/auth.routes.js")

app.use("/api/auth",authRouter)


const interviewRouter = require("./routes/interview.routes.js")

app.use("/api/interview",interviewRouter)



module.exports = app;