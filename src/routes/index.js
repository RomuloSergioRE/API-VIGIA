import express from "express";
import users from "./userRoute.js";
import clients from "./clientRoute.js";
import auth from "./authRoute.js"

const routes = (app)=>{
    app.route("/").get((req, res)=>{
        res.status(200).send({title: "api funcionando"});
    })
    app.use(
        express.json(),
        auth,
        users,
        clients,
    )
}

export default routes;