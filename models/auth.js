"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Auth extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }

    Auth.init(
        {
            token: DataTypes.TEXT,
            user_id: DataTypes.INTEGER,
            expires_at: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Auth",
        }
    );
    return Auth;
};