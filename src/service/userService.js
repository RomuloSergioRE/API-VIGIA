import Users from "../models/userModel.js"
import bcrypt from "bcryptjs";

const createUser = async (data) => {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hash(data.password, salt);

    await Users.create({
        name: data.name,
        email: data.email,
        password: hashPassword,
        admin: data.admin
    })
}
const destroyUser = async (data) => {
    await Users.destroy({
        where: {
            email: data.email
        }
    })
}

export default {createUser, destroyUser};