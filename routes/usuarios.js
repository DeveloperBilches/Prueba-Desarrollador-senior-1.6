const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const { check, validationResult } = require("express-validator");
const moment = require("moment");
const jwt = require("jwt-simple");

const router = require("express").Router();
//obtener
router.get("/", async(req, res) => {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
});

//consultar
router.get("/:id", async(req, res) => {
    const { id } = req.params
    const usuario = await Usuario.findByPk(id);
    res.json(usuario);
});

//registrar
router.post("/registro", [
    check("nombre", "El nombre es un campo obligatorio").not().isEmpty(),
    check("email", "Digite un email valido").isEmail(),
    check("password", "El password es un campo obligatorio").not().isEmpty(),
    check("rol", "El rol es un campo obligatorio").not().isEmpty()
], async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errores: errors.array() })
    }
    const user = await Usuario.findOne({ where: { email: req.body.email } })
    if (!user) {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        const usuario = await Usuario.create(req.body);
        res.json(usuario);
    } else {
        res.json({ error: "ya hay un usuario registrado con el correo digitado" });
    }

});

//login
router.post("/login", async(req, res) => {
    const user = await Usuario.findOne({ where: { email: req.body.email } })
    if (user) {
        const iguales = bcrypt.compareSync(req.body.password, user.password);
        if (iguales) {
            res.json({ authToken: crearToken(user) })
        } else {
            res.json({ error: "Error de contraseña" })
        }
    } else {
        res.json({ error: "Correo no registrado en la base de datos" })
    }
});

//actualizar
router.put("/:id", async(req, res) => {
    const usuario = await Usuario.update(req.body, {
        where: { id: req.params.id }
    });
    res.json({ succes: 'Se ha modificado' });
});

//eliminar
router.delete("/:id", async(req, res) => {
    const usuario = await Usuario.destroy({
        where: { id: req.params.id }
    });
    res.json({ succes: 'Se ha borrado el usuario' });
});

//genera Token
const crearToken = (user) => {
    const payload = {
        UsuarioID: user.id,
        rol: user.rol,
        CreadoEn: moment().unix(),
        ExpiraEn: moment().add(5, 'minutes').unix()
    }

    return jwt.encode(payload, 'DesarrolladorSenior');
}

module.exports = router;