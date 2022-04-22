const { Sequelize } = require("sequelize");

const db = new Sequelize('desarrolladorseniorprueba', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = db;