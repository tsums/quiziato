/**
 * Created by trevor on 9/27/15.
 */

/*
    Connect-Session store using Redis Memory Cache for persistent sessions and speed.
 */

var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var redisURI = process.env.REDISCLOUD_URL;
var redisInfo = require("redis-url").parse(redisURI);

var redisSessionStore = new RedisStore({
    host: redisInfo.hostname,
    port: redisInfo.port,
    db: Number(redisInfo.database),
    pass: redisInfo.password
});

module.exports = redisSessionStore;
