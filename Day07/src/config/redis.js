const redis = require('redis');

const redisClient = redis.createClient({
  username: 'default',
  password: process.env.REDIS_PASS,
  socket: {
    host: 'redis-18857.crce182.ap-south-1-1.ec2.redns.redis-cloud.com',
    port: 18857
  }
});

module.exports = redisClient;
