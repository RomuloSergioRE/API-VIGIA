import express from "express";
import bodyParser from 'body-parser';
import AuthController from "../controllers/authController.js";
import UserController from "../controllers/userController.js";

const router = express.Router()

router
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())
    .get("/auth/logout", AuthController.Logout)
    .post("/auth/login", AuthController.Login)
    .post("/auth/register", UserController.registerUser)

export default router;