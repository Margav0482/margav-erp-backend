const AuthController = require("../controllers/authController");
const SwaggerController = require("../controllers/SwaggerController");
const path = require("path");
const verifyJWT = require("../handler/verifyJWT");
const verifyAdmin = require("../handler/isAdmin");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/swagger", SwaggerController.getItem);

    app.post("/api/login", AuthController.login);
    app.post("/api/logout", AuthController.logout);
    app.post("/api/signup", AuthController.signup);

    // Default Routes
    app.get("/api/*/:id", [verifyJWT, verifyAdmin], async (req, res, next) => {
        try {
            const url = req.url.split("/");
            const rootPath = path.join(__dirname, "../");
            const controllerName = url[2] + "Controller.js";
            const controllerObject = require(rootPath +
                "controllers/" +
                controllerName);
            return await controllerObject.getItem(req, res, next);
        } catch (err) {
            res.status(500).json({error: err});
        }
    });

    app.get("/api/*", [verifyJWT], async (req, res, next) => {
        try {
            const url = req.url.split("/");
            const cName = url[2].split("?") ? url[2].split("?")[0] : url
            const rootPath = path.join(__dirname, "../");
            const controllerName = cName + "Controller.js";
            const controllerObject = require(rootPath +
                "controllers/" +
                controllerName);
            return await controllerObject.listItems(req, res, next);
        } catch (err) {
            res.status(500).json({error: err});
        }
    });

    app.post("/api/*/:id", [verifyJWT], async (req, res, next) => {
        try {
            const url = req.url.split("/");
            const rootPath = path.join(__dirname, "../");
            const controllerName = url[2] + "Controller.js";
            const controllerObject = require(rootPath +
                "controllers/" +
                controllerName);
            return await controllerObject.createItem(req, res, next);
        } catch (err) {
            res.status(500).json({error: err});
        }
    });

    app.post("/api/*", [verifyJWT], async (req, res, next) => {
        try {
            const url = req.url.split("/");
            const rootPath = path.join(__dirname, "../");
            const controllerName = url[2] + "Controller.js";
            const controllerObject = require(rootPath +
                "controllers/" +
                controllerName);
            return await controllerObject.createItem(req, res, next);
        } catch (err) {
            res.status(500).json({error: err});
        }
    });

    app.put("/api/*/:id", [verifyJWT], async (req, res, next) => {
        try {
            const url = req.url.split("/");
            const rootPath = path.join(__dirname, "../");
            const controllerName = url[2] + "Controller.js";
            const controllerObject = require(rootPath +
                "controllers/" +
                controllerName);
            return await controllerObject.updateItem(req, res, next);
        } catch (err) {
            res.status(500).json({error: err});
        }
    });

    app.delete("/api/*/:id", [verifyJWT], async (req, res, next) => {
        try {
            const url = req.url.split("/");
            const rootPath = path.join(__dirname, "../");
            const controllerName = url[2] + "Controller.js";
            const controllerObject = require(rootPath +
                "controllers/" +
                controllerName);
            return await controllerObject.deleteItem(req, res, next);
        } catch (err) {
            res.status(500).json({error: err});
        }
    });
};