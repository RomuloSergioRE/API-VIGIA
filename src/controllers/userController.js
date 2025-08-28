import Users from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import config from "../config/config.js";
import user from "../utils/variables/user.js";
import bcrypt from "bcryptjs";


class UserController {
    static getAllUsers = async function (req, res) {
        try {
            const allUsers = await Users.findAll()

            if (allUsers) {

                res.status(200).json({
                    message: "users found",
                    data: allUsers.map((u) => ({
                        id: u.user_id,
                        name: u.name,
                        email: u.email,
                        admin: u.admin

                    }))
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
            if (req.url === "/auth/user") {
                user.id = req.id
            } else {
                user.id = req.params.id
            }

            const userData = await Users.findOne({
                where: {
                    user_id: user.id
                }
            })
            if (userData) {
                res.status(200).json({
                    message: "user found successfully",
                    data: {
                        id: userData.user_id,
                        name: userData.name,
                        email: userData.email,
                        admin: userData.admin

                    }

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
                return res.status(409).json({
                    message: "User already exists"
                })
            }
            const creatUser = await Users.create({
                name: user.name,
                email: user.email,
                password: hashPassword,
                admin: user.admin
            })
            if (creatUser) {
                var token = jwt.sign({ id: creatUser.user_id, role: creatUser.admin }, config.secretKey, { expiresIn: 86400 });
                return res.status(201).json({
                    message: "User created successfully",
                    auth: true,
                    token: token
                })
            } else {
                return res.status(404).json({ message: "user not created" })
            }


        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
    static updateUser = async function (req, res) {
        try {
            if (req.url === "/auth/user") {
                user.id = req.id
            } else {
                user.id = req.params.id
            }
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
                    message: "user deleted successfully",
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