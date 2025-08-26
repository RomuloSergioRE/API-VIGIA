import Clients from "../models/clientModel.js";
import Users from "../models/userModel.js";
import user from "../utils/variables/user.js";

class ClientController {
    //pegar todos os clientes
    static getAllClient = async function (req, res) {
        try {
            user.id = req.id

            const result = await Users.findByPk(user.id, { include: Clients });

            if (!result) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            if (!result.clients || result.clients.length === 0) {
                return res.status(200).json({
                    message: "This user has no clients",
                    data: []
                });
            }

            const allClients = result.clients.map((c) => c.dataValues);
            res.status(200).json({
                message: "User clients retrieved successfully",
                data: allClients
            });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    //pegar todos os clientes que não pagaram
    static getUnpaidClient = async function (req, res) {
        try {
            const idUser = req.id

            Users.findByPk(idUser, { include: Clients }).then(async (result) => {

                const allClient = result.clients.map((a) => a.dataValues);

                if (allClient.length > 0) {
                    const checkClient = await Clients.findAll({
                        where: {
                            status: "NaoPago"
                        }
                    });
                    if (checkClient) {
                        res.status(200).json({ message: "todos os clientes que estao devendo", data: checkClient });
                    } else {
                        res.status(200).json({ message: "esse usuario nao tem clientes devendo", data: [] });
                    }
                } else {
                    res.status(200).json({ message: "esse usuario nao tem clientes", data: [] });
                }

            })
        } catch (error) {
            res.status(404).json({ message: error });
        }
    }
    //pegar o client pelo ID
    static getClientId = async function (req, res) {
        try {
            const idUser = req.id;
            const idClient = req.params.id;

            Users.findByPk(idUser, { include: Clients }).then((result) => {
                const allClient = result.clients.map((a) => a.dataValues);

                if (allClient.length > 0) {
                    Clients.findOne({
                        where: {
                            client_id: idClient,
                            userId: idUser
                        }
                    }).then((client) => {
                        if (client !== null) {
                            res.status(200).json({ message: "dado do cliente encontrado", data: client });
                        } else {
                            res.status(200).json({ message: "esse ID de cliente nao encontrado", data: [] });
                        }
                    })
                } else {
                    res.status(200).json({ message: "esse usuario nao tem clientes", data: [] });
                }

            })
        } catch (error) {
            res.status(404).json({ message: error });
        }
    }
    //registrar um client 
    static registerClient = async function (req, res) {
        try {
            user.id = req.id
            const nameClient = req.body.name;
            const dateClient = req.body.date;
            const phoneClient = req.body.phone;
            const amountVehiclesClient = req.body.amountVehicles;
            const paymentAmountClient = req.body.paymentAmount;
            const statusClient = req.body.status;

            const checkClient = await Clients.findOne({
                where: {
                    phone: phoneClient
                }
            });

            if (checkClient) {
                res.status(500).json({ message: "ja existe um usuario" })
            } else {
                Clients.create({
                    name: nameClient,
                    date: dateClient,
                    phone: phoneClient,
                    amountVehicles: amountVehiclesClient,
                    paymentAmount: paymentAmountClient,
                    status: statusClient,
                    userId: user.id,
                }).then(() => {
                    res.status(200).send({
                        message: "cliente criado com sucesso",
                        data: {
                            name: nameClient,
                            date: dateClient,
                            phone: phoneClient,
                            amountVehicles: amountVehiclesClient,
                            paymentAmount: paymentAmountClient,
                            status: statusClient,
                        }
                    })
                })
            }
        } catch (error) {
            res.status(404).json({ message: error });
        }
    }
    //update um client
    static updateClient = async function (req, res) {
        try {
            const idUser = req.id;
            const idClient = req.params.id;
            const nameClient = req.body.name;
            const dataClient = req.body.date;
            const phoneClient = req.body.phone;
            const amountVehiclesClient = req.body.amountVehicles;
            const paymentAmountClient = req.body.paymentAmount;
            const statusClient = req.body.status;
            Users.findByPk(idUser, { include: Clients }).then(async (result) => {
                const allClient = result.clients.map((a) => a.dataValues);
                if (allClient.length > 0) {
                    const checkClient = await Clients.findOne({
                        where: {
                            client_id: idClient,
                            userId: idUser
                        }
                    })
                    if (checkClient) {
                        Clients.update(
                            {
                                name: nameClient,
                                date: dataClient,
                                phone: phoneClient,
                                amountVehicles: amountVehiclesClient,
                                paymentAmount: paymentAmountClient,
                                status: statusClient,
                            },
                            {
                                where: {
                                    client_id: idClient,
                                    userId: idUser
                                }
                            }
                        )
                        res.status(200).json({ message: "usuario atualizado com sucesso" })
                    } else {
                        res.status(404).json({ message: "id do usuario nao encontrado ou o usuarioa ja foi atualizado" })
                    }
                } else {
                    res.status(200).json({ message: "esse usuario nao tem clientes", data: [] });
                }

            })

        } catch (error) {
            res.status(404).json({ message: error });
        }
    }
    //deletar um client
    static deleteClient = async function (req, res) {
        try {
            const idUser = req.id;
            const idClient = req.params.id;
            Users.findByPk(idUser, { include: Clients }).then(async (result) => {

                const allClient = result.clients.map((a) => a.dataValues);

                if (allClient.length > 0) {

                    const checkClient = await Clients.findOne({
                        where: {
                            client_id: idClient,
                            userId: idUser
                        }
                    })

                    if (checkClient) {
                        Clients.destroy({
                            where: {
                                client_id: idClient,
                                userId: idUser
                            }
                        })
                        res.status(200).json({ message: "cliente deletado com sucesso" })
                    } else {
                        res.status(404).send({ message: "id do cliente nao encontrado ou o cliente ja foi deletado" })
                    }
                } else {
                    res.status(200).send({ message: "esse usuario nao tem clientes", data: [] });
                }

            })
        } catch (error) {
            res.status(404).send({ message: error });
        }
    }
}

export default ClientController;