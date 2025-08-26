import Users from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from "../config/config.js";
import user from "../utils/variables/user.js";

class UserController {
    static getAllUsers = async function (req, res) {
        try {
            const allUsers = await Users.findAll()

            if (allUsers) {
                res.status(200).json({
                    message: "users found",
                    data: allUsers
                })
            } else {
                res.status(404).json({
                    message: "users not found",
                    data: []
                })
            }
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
    static getUserId = async function (req, res) {
        try {
            user.id = req.params.id

            const userData = await Users.findOne({
                where: {
                    user_id: user.id
                }
            })
            if (userData) {
                res.status(200).json({
                    message: "user found successfully",
                    data: userData

                })
            } else {
                res.status(404).json({
                    message: "user not found",
                    data: []
                })
            }
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
    static registerUser = async function (req, res) {
        try {
            user.name = req.body.name
            user.email = req.body.email
            user.password = req.body.password
            user.admin = req.body.admin

            const salt = bcrypt.genSaltSync(10);
            const hashPassword = await bcrypt.hash(user.password, salt);

            const checkUser = await Users.findOne({
                where: {
                    email: user.email,
                }
            })

            if (checkUser) {
                res.status(409).json({
                    message: "user already exists"
                })
            } else {
                Users.create({
                    name: user.name,
                    email: user.email,
                    password: hashPassword,
                    admin: user.admin
                }).then(function (user) {
                    var token = jwt.sign({ id: user.user_id }, config.secretKey, { expiresIn: 86400 });
                    res.status(201).json({
                        message: "user created successfully",
                        auth: true,
                        token: token
                    })
                })
            }
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
    static updateUser = async function (req, res) {
        try {
            user.id = req.params.id
            user.name = req.body.name
            user.email = req.body.email
            user.password = req.body.password
            user.admin = req.body.admin

            const salt = bcrypt.genSaltSync(10);
            const hashPassword = await bcrypt.hash(user.password, salt);

            const checkUser = await Users.findOne({
                where: {
                    user_id: user.id,
                }
            })
            if (checkUser) {
                Users.update(
                    {
                        name: user.name,
                        email: user.email,
                        password: hashPassword,
                        admin: user.admin
                    },
                    {
                        where: {
                            user_id: user.id
                        }
                    }
                )
                res.status(200).json(
                    {
                        message: "user updated successfully",
                        data: {
                            name: user.name,
                            email: user.email,
                        }
                    })
            } else {
                res.status(404).json({ message: "user not found" })
            }
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
    static deleteUser = async function (req, res) {
        try {
            user.id = req.params.id

            const delUser = await Users.destroy({
                where: { user_id: user.id }
            })

            if (delUser) {
                res.status(200).json({
                    message: `User with ID ${user.id} has been deleted.`,
                })
            } else {
                res.status(404).json({
                    message: "user not found",
                })
            }
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}

export default UserController;