import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import db from "./config/dcConnect.js";
import bodyParser from "body-parser";

const app = express();

db.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});
//romulo@gmail.com
//123
//ana@gmail.com
//12345
//joao_carlos@gmail.com
//12345336
// {
//     "name": "",
//     "data": "",
//     "phone": "",
//     "amountVehicles": ,
//     "paymentAmount": ,
//     "status": ""
// }
//db.sync({force: true})

// User.create({
//     name: "ana",
//     email: "ana@gmail.com",
//     password: "12345"
// })


// Client.create({
//     name: "romulo4", 
//     date:"20/90/0000",
//     phone:"85999999999", 
//     amountVehicles:200,
//     paymentAmount:2000, 
//     status:"nao pago", 
//     userId: 2,
// })


// Client.destroy({
//     where:{
//         name: "joao"
//     }
// })

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.json());
app.use(cors());
routes(app);

export default app;
