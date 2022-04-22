const { DataTypes } = require("sequelize");
const db = require("../db/database");

const Factura = db.define("Factura", {
    idCliente: {
        type: DataTypes.INTEGER,
        references: {
            model: 'usuarios',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    totalFactura: {
        type: DataTypes.INTEGER
    }
})

module.exports = Factura;