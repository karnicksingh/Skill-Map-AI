const  { createClient }  = require("redis");

const redisClient = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'hand-ray-rule-12870.db.redis.io',
        port: 12138
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

async function connectRedis() {
    await redisClient.connect();
    console.log('Redis connected successfully');
}

module.exports = { redisClient, connectRedis };
