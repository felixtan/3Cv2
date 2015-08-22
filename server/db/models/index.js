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

// PTG
db.Driver.belongsToMany(db.DriverLog, { as: 'PtgLogs', through: 'Driver_DriverLogs' });
db.PtgLog.belongsToMany(db.DriverLog, { through: 'Ptg_DriverLogs' });

// Car Maintenance
db.Car.belongsToMany(db.CarLog, { as: 'MaintenanceLogs', through: 'Car_CarLogs' });
db.MaintenanceLog.belongsToMany(db.CarLog, { through: 'Maintenance_CarLogs' });

// trying n:m relationship for flexibility
// db.GasCard.belongsToMany(db.Driver, { through: 'DriverAssets' });
// db.EzPass.belongsToMany(db.Driver, { through: 'DriverAssets' });
// db.Driver.belongsToMany(db.GasCard, { through: 'DriverAssets' });
// db.Driver.belongsToMany(db.EzPass, { through: 'DriverAssets' });

// this works
// db.Driver.hasMany(db.GasCard);
// db.Driver.hasMany(db.EzPass);

// Driver assets
db.GasCard.belongsToMany(db.GasCardLog, { as: 'Log', through: 'GasCard_GasCardLogs' });
db.Driver.belongsToMany(db.GasCard, { through: 'GasCardAssignment' });
db.GasCard.belongsToMany(db.Driver, { through: 'GasCardAssignment' });
db.EzPass.belongsToMany(db.EzPassLog, { as: 'Log', through: 'GasCardAssignment' });
db.Driver.belongsToMany(db.EzPass, { through: 'EzPassAssignment' });

Object.keys(db).forEach(function(modelName) {
 if ("associate" in db[modelName]) {
    db[modelName].associate(db);
 }
});
 
db.sequelize = sequelize;
db.Sequelize = Sequelize;
 
module.exports = db;