import express from "express";
import UserController from "../controllers/userController.js";
import bodyParser from 'body-parser';
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router()

router
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())
    .get("/users/:id", UserController.getUserId)
    .post("/users", UserController.registerUser)
    .put("/update/user",verifyToken, UserController.updateUser)

export default router;