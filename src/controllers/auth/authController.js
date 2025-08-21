import bcrypt from 'bcryptjs';
import config from "../../config/config.js";
import Users from "../../models/userModel.js";
import jwt from "jsonwebtoken"

class AuthController {
    static Login = async function(req, res){
        const userEmail = req.body.email;
        const userPassword = req.body.password;

        await Users.findOne({
            where: {
                email: userEmail,
            }
        }).then(user=>{
            if(!user){
                res.status(200).send({message: "usuario nao encontrado"})
            }else{
                const checkPassword =  bcrypt.compareSync(userPassword, user.password)
                if (!checkPassword) {
                    return res.status(200).send({ data:{auth: false, token: null, message: 'Senha incorreta'}});
                }
                const token = jwt.sign({ id: user.user_id,}, config.secretKey,{
                    expiresIn: 86400
                }); 
                res.set('Authorization', 'Bearer ' + token);
                res.status(200).send({ data:{auth: true, token: token} });
            }
        })
    }
    static Logout = async function(req, res){
        res.status(200).send({ auth: false, token: null });
    }
    static GetUser = async function(req, res, next){
        Users.findOne({
            where:{
                user_id: req.id
            },

        }).then((user)=>{
            user.password = 0;
            res.status(200).send(user)

        })
    }
}

export default AuthController;