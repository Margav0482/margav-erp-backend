"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const {dbConfig} = require("../configuration/db");
const db = {};

let sequelize;

if (dbConfig().useDev) {
    sequelize = new Sequelize.Sequelize(
        dbConfig().development.database,
        dbConfig().development.username,
        dbConfig().development.password,
        {
            dialect: dbConfig().development.dialect,
            port: dbConfig().development.port,
            logging: console.log,
            sync: true,
            define: {
                freezeTableName: true
            },
        }
    )
} else {
    sequelize = new Sequelize.Sequelize(
        dbConfig().production.database,
        dbConfig().production.username,
        dbConfig().production.password,
        {
            dialect: dbConfig().production.dialect,
            port: dbConfig().production.port,
            sync: true,
            define: {
                freezeTableName: true
            },
        }
    )
}

if (dbConfig().useDev) {
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