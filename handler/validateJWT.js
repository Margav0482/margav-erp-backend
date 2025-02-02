const {expressjwt} = require("express-jwt");
require("dotenv/config");

function validateJWT() {
    const secret = process.env.SECRETKEY;
    return expressjwt({secret, algorithms: ["HS256"]}).unless({
        path: ["api/login", "api/signup"],
    });
}

module.exports = validateJWT;