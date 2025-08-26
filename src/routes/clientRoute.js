import express from "express";
import ClientController from "../controllers/clientController.js";
import bodyParser from 'body-parser';
import verifyToken from "../middlewares/verifyToken.js";
import updateDateClient from "../middlewares/updateDateClient.js";

const router = express.Router();

router
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())
    .get("/auth/client", verifyToken, updateDateClient, ClientController.getAllClient)
    .get("/auth/client/unpaid", verifyToken, ClientController.getUnpaidClient)
    .get("/auth/client/:id", verifyToken, ClientController.getClientId)
    .post("/auth/client", verifyToken, ClientController.registerClient)
    .put("/auth/client/:id", verifyToken, ClientController.updateClient)
    .delete("/auth/client/:id", verifyToken, ClientController.deleteClient)

export default router;