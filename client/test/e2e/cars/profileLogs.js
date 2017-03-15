"use strict";

let helpers = require("../../helpers/e2e/helpers.js"),
    elems = require("../../helpers/e2e/editField.js");

decribe("Car Logs", function () {
    
    beforeEach(function() {
        browser.get('http://localhost:3000/#/dashboard/cars');
    });
});