import express from "express";
import bodyParser from 'body-parser';
import verifyToken from "../middlewares/verifyToken.js";
import AuthController from "../controllers/auth/authController.js";

const router = express.Router()

router
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())
    .post("/login", AuthController.Login)
    .get("/me", verifyToken, AuthController.GetUser)
    .get("/logout", AuthController.Logout)

export default router;