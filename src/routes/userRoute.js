import express from "express";
import UserController from "../controllers/userController.js";
import bodyParser from 'body-parser';
import verifyToken from "../middlewares/verifyToken.js";
import isAdmin from "../middlewares/isAdmin.js"

const router = express.Router()

router
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())
    .get("/auth/users", verifyToken, isAdmin,UserController.getAllUsers)// Buscar todos Usuario (ADMIN)
    .get("/auth/user/:id", verifyToken, isAdmin, UserController.getUserId)// Buscar Usuario pelo ID (ADMIN)
    .get("/auth/user", verifyToken, UserController.getUserId)//// Buscar Usuario logado
    .post("/auth/user", verifyToken,isAdmin, UserController.registerUser)// Criar usuario (ADMIN)
    .put("/auth/user/:id", verifyToken, isAdmin, UserController.updateUser)// Editar usuario (ADMIN)
    .put("/auth/user/", verifyToken, UserController.updateUser)// Editar usuario logado
    .delete("/auth/user/:id", verifyToken, isAdmin, UserController.deleteUser)// deletar usuario (ADMIN)

export default router;