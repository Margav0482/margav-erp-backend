const jwt = require("jsonwebtoken");
require("dotenv/config");
const Model = require("../models/index");

async function verifyJWT(req, res, next) {
    try {
        const secret = process.env.secretKey;
        const token = req?.headers["authorization"]?.split(" ")[1];
        const tokenDecoded = jwt.verify(token, secret);
        if (process.env.NODE_ENV !== "test" && Date.now() >= tokenDecoded.exp * 1000) {
            return res.status(401).json({message: "Unauthorized"});
        }
        const User = await Model.Users.findOne({
            where: {id: tokenDecoded.userData.id},
        });
        if (!User) {
            return res.status(404).json({message: "User not found!"});
        }
        req.currentUser = User;
        next();
    } catch (e) {
        return res.status(500).json({message: e.message});
    }
}

module.exports = verifyJWT;