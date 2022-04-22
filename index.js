const express = require("express");
const db = require("./db/database");
const usuarios = require("./routes/usuarios");
const productos = require("./routes/productos");
const detalleFactura = require("./routes/detallefactura");
const app = express();
const cors = require('cors');
const middleware = require("./middleware");
const factura = require("./routes/factura");
const port = process.env.PORT || 3000;

//middleware
app.use(express.json());
app.use(cors());

(async() => {
    try {
        await db.authenticate();
        await db.sync();
        console.log("Se ejecuto exitosamente");
    } catch (error) {
        throw new Error(error)
    }

})()




app.use(express.json());
app.use("/usuarios", usuarios);
app.use("/productos", middleware.checkToken, productos);
app.use("/factura", middleware.checkToken, detalleFactura);

app.listen(port, () => {
    console.log("servidor ejecutandose...")
})