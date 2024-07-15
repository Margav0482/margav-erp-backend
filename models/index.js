"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require("../configuration/db.js");
const db = {};

let sequelize;

if (config.useDev) {
    sequelize = new Sequelize.Sequelize(
        config.development.database,
        config.development.username,
        config.development.password,
        {
            dialect: config.development.dialect,
            port: config.development.port,
            logging: console.log,
            sync: true,
            define: {
                freezeTableName: true
            },
        }
    )
} else {
    sequelize = new Sequelize.Sequelize(
        config.production.database,
        config.production.username,
        config.production.password,
        {
            dialect: config.production.dialect,
            port: config.production.port,
            sync: true,
            define: {
                freezeTableName: true
            },
        }
    )
}

if (config.useDev) {
    (async () => {
        // This will sync the tables if they are not created or their attributes are changed.
        await sequelize.sync(({alter: true}));
    })();
}


fs.readdirSync(__dirname)
    .filter((file) => {
        return (
            file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
        );
    })
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(
            sequelize,
            Sequelize.DataTypes
        );
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;