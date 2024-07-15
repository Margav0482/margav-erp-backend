const ValidationError = require("./validation/error");
function errorHandler(err, req, res, next) {
    if (typeof err === "string") {
        // custom application error
        return res.status(400).json({ message: err });
    }

    if (err.name === "UnauthorizedError") {
        // jwt authentication error
        return res.status(401).json({ status: "ERROR", message: "Unauthorized" });
    }

    if (err instanceof ValidationError) {
        return res.status(400).json({ status: "ERROR", message: err.message });
    }
    // default to 500 server error
    console.log(err);
    return res.status(500).json({ message: err.message });
}

module.exports = errorHandler;