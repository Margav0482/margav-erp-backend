const {expressjwt} = require("express-jwt");
require("dotenv/config");

function jwt() {
    const secret = process.env.secretKey;
    return expressjwt({secret, algorithms: ["HS256"]}).unless({
        path: [
            // public routes that don't require authentication
            "/api/login",
            "/api/signup",
            "/api/logout",
            "/api/swagger",
            "/api/swagger-ui",
        ],
    });
}

module.exports = jwt;