const db = require("../models/index");

function verifyAdmin(req, res, next) {
    try {
        const ADMIN_ROLE = 0;
        const currentUserRole = req.currentUser.role;
        if (ADMIN_ROLE !== currentUserRole) {
            return res.status(403).json({message: "UnAuthorized Access"});
        }
        next();
    } catch (e) {
        return res.status(500).json({message: e.message});
    }
}

module.exports = verifyAdmin;