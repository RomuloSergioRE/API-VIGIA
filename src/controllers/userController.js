import Users from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from "../config/config.js";

class UserController {
    static getUserId = async function(req, res){
        try{
            const userId = req.params.id
            const userData = await Users.findOne({
                where:{
                    user_id: userId
                }
            })
            if(userData){
                res.status(200).json({message:"usuario encontro com sucesso", data: userData})
            }else{
                res.status(200).json({message:"usuario nao encontrado", data: []})
            }
        }catch(error){
            res.status(404).json({message: error})
        }
    }
    static registerUser = async function(req, res){
        try{
            const userName = req.body.name
            const userEmail = req.body.email
            const userPassword = req.body.password

            const salt =  bcrypt.genSaltSync(10);
            const hashPassword = await bcrypt.hash(userPassword, salt);
            
            const checkUser = await Users.findOne({
                where:{
                    email: userEmail,
                }
            })
            if(checkUser){
                res.status(500).json({message: "ja existe um usuario"})
            }else{
                Users.create({
                    name: userName,
                    email: userEmail,
                    password: hashPassword,
                }).then(function (user){
                    var token = jwt.sign({ id: user.user_id }, config.secretKey, {
                        expiresIn: 86400 
                    });
                    res.status(200).json({
                        message: "usuario criado com sucesso",
                        auth: true,
                        token: token
                    })
                })
            }
        }catch(error){
            res.status(404).json({message: error})
        }
    }
    static updateUser = async function(req, res){
        try{
            const idUser = req.id
            const userName = req.body.name
            const userEmail = req.body.email
            const userPassword = req.body.password

            const salt =  bcrypt.genSaltSync(10);
            const hashPassword = await bcrypt.hash(userPassword, salt);
            
            const checkUser = await Users.findOne({
                where:{
                    user_id: idUser,
                }
            })
            if(checkUser){
                Users.update(
                    {
                        name: userName,
                        email: userEmail,
                        password: hashPassword,
                    },
                    {
                        where: {
                            user_id: idUser
                        }
                    }
                )
                res.status(200).json(
                    {
                        message: "usuario atualzado com sucesso", 
                        data: {
                                name: userName,
                                email: userEmail,
                              }
                    })
            }else{
                res.status(500).json({message: "A atualizacao do usuario falhou"})
            }
        }catch(error){
            res.status(404).json({message: error})
        }
    }
}

export default UserController;