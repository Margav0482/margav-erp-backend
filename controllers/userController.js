const Model = require("../models/index");
const Validator = require("validatorjs");
const ValidationError = require("../handler/validation/error");
const bcrypt = require("bcrypt");
require("dotenv/config");
const {getPaginated, pagination} = require("../util/common");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The User managing API
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
 *           description: The user first name
 *         last_name:
 *           type: string
 *           description: The user last name
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *           type: string
 *           description: The user password
 *         date_of_birth:
 *           type: string
 *           description: The user birth date
 *
 */

/**
 * @openapi
 * /user:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
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
exports.createItem = async (req, res, next) => {
    try {
        const data = req.body;
        const user = new Model.Users();
        const {validationRule, customMessage} = await user.validationRequest(
            "create"
        );
        data.password = bcrypt.hashSync(data.password, 10);
        const validation = new Validator(data, validationRule, customMessage);
        if (validation.fails()) {
            return next(
                new ValidationError(
                    JSON.parse(JSON.stringify(validation.errors)).errors
                )
            );
        }
        const userSave = await Model.Users.create(data);
        return res.status(200).json({data: userSave, message: "Manual User created."});
    } catch (e) {
        return res.status(500).json({status: "ERROR", message: e.message});
    }
};

/**
 * @openapi
 * /user:
 *   get:
 *     summary: Returns the list of all the user
 *     tags: [Users]
 *     security:
 *       - jwt: []
 *     parameters:
 *       - in: query
 *         name:  page
 *         type: integer
 *       - in: query
 *         name: size
 *         type: integer
 *       - in: query
 *         name: sortKey
 *         type: string
 *       - in: query
 *         name: search
 *         type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *          type: string
 *          enum: [ASC, DESC]
 *     responses:
 *       200:
 *         description: The user was successfully created
 *       400:
 *         description: validation error
 *       401:
 *         description: unauthorized
 *       500:
 *         description: Some server error
 *
 */
exports.listItems = async (req, res, next) => {
    try {
        const {page, size, search, sortBy, sortKey} = req.query;
        const {limit, offset} = await getPaginated(size, page);
        const order = [[sortKey ? sortKey : "id", sortBy ? sortBy : "DESC"]];
        const data = await Model.Users.findAndCountAll({
            where: {
                is_deleted: 0,
            },
            limit: limit,
            offset: offset,
            order: order,
        });
        let response = await pagination(data, page, limit);
        return res.status(200).json({data: response, message: "Item List"});
    } catch (e) {
        return res.status(500).json({status: "ERROR", message: e.message});
    }
};

/**
 * @openapi
 * /user/{id}:
 *   get:
 *     summary: Get the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: The user was successfully created
 *       400:
 *         description: validation error
 *       401:
 *         description: unauthorized
 *       404:
 *         description: No user found
 *       500:
 *         description: Some server error
 */
exports.getItem = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await Model.Users.findOne({
            where: {id: userId, is_deleted: 0},
        });
        if (!user) {
            return res
                .status(404)
                .json({status: "ERROR", message: "User not found."});
        }
        return res.status(200).json({data: user, message: "User Found."});
    } catch (e) {
        return res.status(500).json({status: "ERROR", message: e.message});
    }
};

/**
 * @swagger
 * /user/{id}:
 *  put:
 *    summary: Update the user by the id
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    security:
 *       - jwt: []
 *    responses:
 *      200:
 *        description: The user was updated
 *      401:
 *         description: unauthorized
 *      404:
 *        description: The user was not found
 *      500:
 *        description: Some error happened
 */

exports.updateItem = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const user = new Model.Users();
        let {validationRule, customMessage} = await user.validationRequest(
            "update"
        );
        const validation = new Validator(data, validationRule, customMessage);
        if (typeof data.entry_test !== typeof true) {
            if (validation.fails()) {
                return next(
                    new ValidationError(
                        JSON.parse(JSON.stringify(validation.errors)).errors
                    )
                );
            }
        }

        const isUser = await Model.Users.findOne({
            where: {
                id: id,
                is_deleted: 0,
            },
        });
        if (!isUser) {
            return res.status(404).json({message: "User not found"});
        }
        let updatedData = await user.prepareUpdateData(data, isUser);
        if(updatedData.entry_test === true){
            updatedData.entry_test = 1;
        }
        console.log("updatedData", updatedData)
        const userUpdate = await isUser.update(updatedData);
        return res.status(200).json({data: userUpdate, message: "Saved Changes!"});
    } catch (e) {
        return res.status(500).json({status: "ERROR", message: e.message});
    }
};

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Remove the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: The user was deleted
 *       400:
 *         description: The given id is not valid
 *       401:
 *         description: unauthorized
 *       404:
 *         description: The user was not found
 */
exports.deleteItem = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await Model.Users.findOne({
            where: {
                id: id,
                is_deleted: 0,
            },
        });
        if (!user) {
            return res
                .status(404)
                .json({status: "ERROR", message: "Item not found."});
        }
        await user.update({is_deleted: 1});
        return res.status(200).json({message: "Item deleted."});
    } catch (e) {
        return res.status(500).json({status: "ERROR", message: e.message});
    }
};