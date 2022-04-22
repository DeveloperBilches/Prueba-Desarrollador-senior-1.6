const jwt = require("jwt-simple");
const moment = require("moment");

const checkToken = (req, res, next) => {

    if (!req.headers['user-token']) {
        return res.json({ error: "Necesitas incluir el user-token en el Header" });
    }
    const authToken = req.headers['user-token'];
    let payload = {};

    try {
        payload = jwt.decode(authToken, 'DesarrolladorSenior');
    } catch (error) {
        return res.json({ error: "El user-token es incorrecto" });
    }

    if (payload.ExpiraEn < moment().unix()) {
        return res.json({ error: "el user-token ha expirado" });
    }

    req.rol = payload.rol;

    next();
}

module.exports = {
    checkToken: checkToken
}