import Sequelize  from "sequelize";
import db from "../config/dcConnect.js";
import Client from "./clientModel.js";

const User = db.define('users',{
    user_id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    },
    admin:{
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
})

User.hasMany(Client, {
    foreignKey: 'userId'
});



export default User;