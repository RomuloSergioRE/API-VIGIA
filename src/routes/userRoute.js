import express from "express";
import UserController from "../controllers/userController.js";
import bodyParser from 'body-parser';
import verifyToken from "../middlewares/verifyToken.js";


const router = express.Router()

router
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())
    .get("/auth/users",verifyToken, UserController.getAllUsers)// Buscar todos Usuario 
    .get("/auth/user/:id",verifyToken, UserController.getUserId)// Buscar Usuario pelo ID 
    .post("/auth/user",verifyToken, UserController.registerUser)// Criar usuario 
    .put("/auth/user/:id",verifyToken, UserController.updateUser)// Editar usuario 
    .delete("/auth/user/:id", verifyToken, UserController.deleteUser)// deletar usuario 

export default router;