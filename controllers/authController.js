const Model = require("../models/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Validator = require("validatorjs");
require("dotenv/config");
const util = require("../util/common");

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: The Authentication managing API
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Authentication:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *           type: string
 *           description: The user password
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         first_name:
 *           type: string
 *           description: The username
 *         last_name:
 *           type: string
 *           description: The username
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *           type: string
 *           description: The user password
 */

/**
 * @openapi
 * /signup:
 *   post:
 *     summary: Signup new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: The user was successfully created
 *       400:
 *         description: validation error
 *       401:
 *         description: unauthorized
 *       500:
 *         description: Some server error
 */
module.exports.signup = async (req, res, next) => {
    try {
        let data = req.body;
        const UserModel = new Model.Users();
        const validationRules = await UserModel.validationRequest("create");
        const validate = new Validator(data, validationRules.validationRule, validationRules.customMessage);
        if (validate.fails()) {
            return res.status(400).json({message: validate.errors});
        }
        const isRegistered = await Model.Users.findOne({
            where: {
                email: data.email,
                is_deleted: 0,
            },
        });
        if (isRegistered) {
            return res.status(400).json({message: "You are already registered!"});
        }
        data["password"] = bcrypt.hashSync(data.password, 10);
        data["role"] = 1;
        const userSave = await Model.Users.create(data);
        return res
            .status(200)
            .json({data: userSave, message: "User Created SuccessFully"});
    } catch (e) {
        return res.status(500).json({message: e.message});
    }
};


/**
 * @openapi
 * /login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Authentication'
 *     responses:
 *       200:
 *         description: The user was successfully created
 *       400:
 *         description: validation error
 *       401:
 *         description: unauthorized
 *       500:
 *         description: Some server error
 */
module.exports.login = async (req, res, next) => {
    try {
        let data = req.body;
        const user = await Model.Users.findOne({
            where: {
                email: data.email,
                is_deleted: 0,
            },
        });
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        const secret = process.env.SECRETKEY;
        if (bcrypt.compareSync(data.password, user.password)) {
            const userData = await util.cleanData(user);
            delete userData.password;
            let date = new Date();
            const expiry = date.setDate(date.getDate() + 1);
            const authToken = await Model.Auth.create({
                user_id: userData.id,
                expires_at: expiry,
            });
            userData["token_id"] = authToken.id;
            const token = jwt.sign(
                {
                    userData,
                },
                secret,
                {expiresIn: "8h"}
            );
            authToken.update({token: token});
            const response = {
                token: token,
                user: user,
            };
            return res
                .status(200)
                .json({data: response, message: "Logged in successfully!"});
        }
        return res.status(404).json({message: "Email Id/Password is incorrect!"});
    } catch (e) {
        return res.status(500).json({message: e.message});
    }
};


/**
 * @openapi
 * /logout:
 *   post:
 *     summary: Logout User
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Authentication'
 *     responses:
 *       200:
 *         description: The user was successfully logged out
 *       401:
 *         description: unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Some server error
 */
module.exports.logout = async (req, res) => {
    try {
        let data = req.body;
        const authUser = await Model.Auth.destroy({
            where: {
                user_id: data.user_id,
            },
        });
        if (!authUser) {
            return res.status(404).json({message: "User not found"});
        }

        return res
            .status(200)
            .json({data: {user: authUser}, message: "Logged out successfully"});

    } catch (e) {
        return res.status(500).json({message: e.message});
    }
};