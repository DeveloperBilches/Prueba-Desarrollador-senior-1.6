const bcrypt = require("bcryptjs");
const Factura = require("../models/Factura");
const Usuario = require("../models/Usuario");
const { check, validationResult } = require("express-validator");
const router = require("express").Router();


//Una Factura esta a nombre de solo un Cliente
Factura.belongsTo(Usuario, { foreignKey: "idCliente" });
//un Cliente puede tener muchas facturas
Usuario.hasMany(Factura, { foreignKey: "idCliente" });

//obtenerFactura
router.get("/", async(req, res) => {
    const usuarios = await Factura.findAll({
        include: [{ model: Usuario }]
    });
    res.json(usuarios);
});


module.exports = router;