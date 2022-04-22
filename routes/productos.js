const bcrypt = require("bcryptjs");
const Productos = require("../models/Producto");
const { check, validationResult } = require("express-validator");
const router = require("express").Router();

//obtenerProductos
router.get("/", async(req, res) => {
    console.log(req.rol);
    if (req.rol == "Administrador") {
        const productos = await Productos.findAll();
        res.json(productos);
    } else {
        res.json({ message: "No es un administrador para ver productos" });
    }

});

//insertarProductos
router.post("/", [
    check("numeroLote", "El numero de lote es un campo obligatorio").not().isEmpty(),
    check("numeroLote", "El numero de lote es un campo numerico").isInt(),
    check("nombre", "El nombre es un campo obligatorio").not().isEmpty(),
    check("precio", "El precio es un campo obligatorio").not().isEmpty(),
    check("precio", "El precio es un campo numerico").isInt(),
    check("cantidadDisponible", "La cantidad disponible es un campo obligatorio").not().isEmpty(),
    check("cantidadDisponible", "La cantidad disponible es un campo numerico").isInt()
], async(req, res) => {
    if (req.rol == "Administrador") {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errores: errors.array() })
        }
        const producto = await Productos.create(req.body);
        res.json(producto);
    } else {
        res.json({ message: "No es un administrador para insertar productos" });
    }

});

//ActualizarProductos
router.put("/:id", async(req, res) => {
    if (req.rol == "Administrador") {
        const prod = await Productos.findOne({ where: { numeroLote: req.params.id } })
        if (prod) {
            const producto = await Productos.update(req.body, {
                where: { numeroLote: req.params.id }
            });
            res.json({ success: "prodcuto actualizado" });
        } else {
            res.json({ error: "No existe producto con ese numero de lote" });
        }
    } else {
        res.json({ message: "No es un administrador para actualizar productos" });
    }


});

//eliminarProdcutos
router.delete("/:id", async(req, res) => {
    if (req.rol == "Administrador") {
        const prod = await Productos.findOne({ where: { numeroLote: req.params.id } })
        if (prod) {
            const producto = await Productos.destroy({
                where: { numeroLote: req.params.id }
            });
            res.json({ success: "producto eliminado" });
        } else {
            res.json({ error: "No existe producto con ese numero de lote" });
        }
    } else {
        res.json({ message: "No es un administrador para actualizar productos" });
    }

});

module.exports = router;