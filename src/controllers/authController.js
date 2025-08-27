import bcrypt from 'bcryptjs';
import config from "../config/config.js";
import Users from "../models/userModel.js";
import jwt from "jsonwebtoken";
import user from '../utils/variables/user.js'

class AuthController {
    static Login = async function (req, res) {
        user.email = req.body.email
        user.password = req.body.password

        const User = await Users.findOne({
            where: {
                email: user.email,
            }
        })
        if (!User) {
            res.status(404).send({ message: "user not found" })
        } else {
            const checkPassword = bcrypt.compareSync(user.password, User.password)

            if (!checkPassword) {
                return res.status(401).send({ data: { auth: false, token: null, message: "incorrect password" } });
            }

            const token = jwt.sign({ id: User.user_id, role: User.admin}, config.secretKey, {
                expiresIn: 86400
            });

            res.set('Authorization', 'Bearer ' + token);
            res.status(200).send({ 
                data: { auth: true, token: token, message: "Login successful" } 
            });
        }

    }
    static Logout = async function (req, res) {
        res.status(200).send({ auth: false, token: null });
    }
}

export default AuthController;