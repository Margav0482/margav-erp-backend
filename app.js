const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config()
const indexRouter = require('./routes/index');
const jwt = require('./handler/jwt');
const swaggerUi = require("swagger-ui-express");
const errorHandler = require("./handler/error");
const {Sequelize} = require("sequelize");
const cors = require('cors');
const app = express();

const corsOptions = {
    credentials: true,
    origin: ['*', 'http://localhost:3000', "http://localhost:8000"] // Whitelist the domains you want to allow
};

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(null, {
        explorer: true,
        swaggerUrl: "/api/swagger",
        customSiteTitle: "API Docs",
    })
);

app.use(jwt());
app.use(errorHandler);

require("./routes")(app);

module.exports = app;