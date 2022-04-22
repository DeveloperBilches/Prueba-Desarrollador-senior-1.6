const { DataTypes } = require("sequelize");
const db = require("../db/database");

const Usuario = db.define("Usuarios", {
    nombre: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    rol: {
        type: DataTypes.STRING
    }
})

module.exports = Usuario;