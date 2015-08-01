"use strict";
 
var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, '../config/config.json'))[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var db = {};
 
fs.readdirSync(__dirname).filter(function(file) {
 return (file.indexOf(".") !== 0) && (file !== "index.js");
}).forEach(function(file) {
 var model = sequelize["import"](path.join(__dirname, file));
 db[model.name] = model;
});

// Model relations
db.Car.belongsToMany(db.Driver, { through: 'Assignment', foreignKey: 'carId' });
db.Driver.belongsToMany(db.Car, { through: 'Assignment', foreignKey: 'driverId' });
db.Driver.hasMany(db.DriverLog, { foreignKey: 'driverId' });
// db.DriverLog.belongsTo(db.Driver);

Object.keys(db).forEach(function(modelName) {
 if ("associate" in db[modelName]) {
    db[modelName].associate(db);
 }
});
 
db.sequelize = sequelize;
db.Sequelize = Sequelize;
 
module.exports = db;