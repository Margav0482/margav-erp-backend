const swaggerJsDoc = require("swagger-jsdoc");
const swaggerDocument = require("../swagger.json");
exports.getItem = async (req, res) => {
    try {
        return res.status(200).json(swaggerJsDoc(swaggerDocument));
    } catch (e) {
        return res.status(500).json({ status: "ERROR", message: e.message });
    }
};