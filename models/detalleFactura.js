const { DataTypes } = require("sequelize");
const db = require("../db/database");

const detalleFactura = db.define("detalleFactura", {
    idFactura: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Facturas',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    idProducto: {
        type: DataTypes.INTEGER,
        references: {
            model: 'productos',
            key: 'numeroLote'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    cantidad: {
        type: DataTypes.INTEGER
    },
    Subtotal: {
        type: DataTypes.INTEGER
    }
})

module.exports = detalleFactura;