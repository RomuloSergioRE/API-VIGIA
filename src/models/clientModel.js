import Sequelize  from "sequelize";
import db from "../config/dcConnect.js";
import User from "./userModel.js";

const Client = db.define('clients',{
    client_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    date: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false
    },
    amountVehicles:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    paymentAmount: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    },

})
Client.associate = () => {
    Client.belongsTo(User, {
      as: 'users',
      foreignKey: 'userId'
    });
};

export default Client;