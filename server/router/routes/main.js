'use strict';

var Cars = require('../../db/models').Car;

module.exports = {

    // Eager loading of cars and drivers
    render: function(req, res) {    
        Car.findAll({ include: [ Driver ] }).then(function(cars) {
            res.json(cars);
        });
    }
}