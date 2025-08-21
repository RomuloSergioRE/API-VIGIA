import express from "express";
import ClientController from "../controllers/clientController.js";
import bodyParser from 'body-parser';
import verifyToken from "../middlewares/verifyToken.js";
import AuthController from "../controllers/auth/authController.js";
import updateDateClient from "../middlewares/updateDateClient.js";

const router = express.Router();

router
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())
    .get("/me/client", verifyToken, updateDateClient, ClientController.getAllClient)
    .get("/me/client/unpaid", verifyToken, ClientController.getUnpaidClient)
    .get("/me/client/:id", verifyToken, ClientController.getClientId)
    .post("/me/register/client", verifyToken, ClientController.registerClient)
    .put("/me/update/client/:id", verifyToken, ClientController.updateClient)
    .delete("/me/delete/client/:id", verifyToken, ClientController.deleteClient)

export default router;