const bcrypt = require("bcryptjs");
const Factura = require("../models/Factura");
const Producto = require("../models/Producto");
const Usuario = require("../models/Usuario");
const detalleFactura = require("../models/detalleFactura");
const { check, validationResult } = require("express-validator");
const router = require("express").Router();

//Una Factura esta a nombre de solo un Cliente
Factura.belongsTo(Usuario, { foreignKey: "idCliente" });
//un Cliente puede tener muchas facturas
Usuario.hasMany(Factura, { foreignKey: "idCliente" });

//Una item de la factura puede estar a nombre de un solo un Cliente
detalleFactura.belongsTo(Factura, { foreignKey: "idFactura" });
//un Cliente puede tener muchas facturas
Factura.hasMany(detalleFactura, { foreignKey: "idFactura" });


Producto.hasMany(detalleFactura, { foreignKey: "idProducto" });
detalleFactura.belongsTo(Producto, { foreignKey: "idProducto" });

//obtenerFactura
router.get("/admin", async(req, res) => {
    if (req.rol == "Administrador") {
        const detallefactura = await Factura.findAll({
            include: [{
                    model: Usuario,
                    required: true,
                    attributes: ['nombre', 'email']
                },
                {
                    model: detalleFactura,
                    required: true,
                    attributes: ['id', 'cantidad', 'Subtotal'],
                    include: {
                        model: Producto,
                        attributes: [
                            ['nombre', 'nombre del producto']
                        ]
                    }
                }

            ],
            attributes: [
                ['createdAt', 'Fecha de factura'], 'totalFactura'
            ]
        });
        res.json(detallefactura);
    } else {
        res.json({ message: "No es un administrador para ver esta seccion" });
    }

});

//obtenerProductosComprados
router.get("/buy/:id", async(req, res) => {
    const detallefactura = await Factura.findAll({
        include: [{
                model: Usuario,
                required: true,
                attributes: ['nombre', 'email']
            },
            {
                model: detalleFactura,
                required: true,
                attributes: ['id'],
                include: {
                    model: Producto,
                    attributes: [
                        ['nombre', 'nombre del producto']
                    ]
                }
            }

        ],
        attributes: ['idCliente'],
        where: { idCliente: req.params.id }
    });
    res.json(detallefactura);
});

//obtenerFacturasCompletas
router.get("/all/:id", async(req, res) => {
    const detallefactura = await Factura.findAll({
        include: [{
                model: Usuario,
                required: true,
                attributes: ['id', 'nombre']
            },
            {
                model: detalleFactura,
                required: true,
                include: {
                    model: Producto,
                    attributes: ['numeroLote', 'nombre', 'precio']
                }
            }

        ],
        where: { id: req.params.id }
    });
    res.json(detallefactura);
});

//registrarCompra
router.post("/compra", async(req, res) => {
    const factura = await Factura.create(req.body);
    var totalfactura = 0;
    for (let index = 0; index < Object.keys(req.body.productos).length; index++) {
        console.log(req.body.productos[index].idFactura);
        totalfactura += req.body.productos[index].Subtotal;
        const detalle = await detalleFactura.create({
            idFactura: factura.id,
            idProducto: req.body.productos[index].idProducto,
            cantidad: req.body.productos[index].cantidad,
            Subtotal: req.body.productos[index].Subtotal
        });
    }
    const total = await Factura.update({ totalFactura: totalfactura }, {
        where: { id: factura.id }
    });

    res.json({ succes: "Comprar Realizada" });



});


module.exports = router;