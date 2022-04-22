const { DataTypes } = require("sequelize");
const db = require("../db/database");

const Productos = db.define("Productos", {
    numeroLote: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING
    },
    precio: {
        type: DataTypes.INTEGER
    },
    cantidadDisponible: {
        type: DataTypes.INTEGER
    }
})

module.exports = Productos;