import Clients from "../models/clientModel.js";
import Users from "../models/userModel.js";

const updateDateClient = (req, res, next) =>{
    let currentDate =  new Date();
    let currentMonth = ""
    
    if(currentDate.getMonth() + 1 === 10){
        currentMonth = currentDate.getMonth() + 1
    }else{
        currentMonth = "0" + (currentDate.getMonth() + 1)
    }
    try {
        const idUser = req.id;
        Users.findByPk(idUser,{include: Clients}).then(async (result)=>{
            const allClient = result.clients.map((a)=> a.dataValues);
            if(allClient.length > 0){
                await Clients.findAll({
                    where:{
                        userId: idUser,
                    }
                }).then((client)=>{
                    if(client !== null){
                        const arrayDateClient = client.map((a)=> a.dataValues.date.split("/"));
                        const statusClient = client.map((a)=> a.dataValues.status);
                        console.log(arrayDateClient);
                        const day = arrayDateClient.map((a)=> a[0]);
                        const month = arrayDateClient.map((a)=> a[1]);
                        const year = arrayDateClient.map((a)=> a[2]);

                        if(month < currentMonth){
                            
                        }
                        const dateClient = ""
                        const newDateClient = dateClient.concat(day+ "/" + currentMonth + "/" + year)
                        //console.log({message:"dado do cliente encontrado", data: mounth});
                    }else{
                        //console.log({message:"esse ID de cliente nao encontrado", data: []});
                    }
                })
            }else{
                //console.log("rteste333")
            }
            
        })
    } catch (error) {
        //res.status(404).json({message: error});
    }
    next();
}

export default updateDateClient;