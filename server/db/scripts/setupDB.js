'use strict';

var models = require('../models');
var Cars = models.Car;
var Drivers = models.Driver;
var Prospects = models.Prospect;
var ProspectStatuses = models.ProspectStatuses;
var Assets = models.Asset;
var AssetTypes = models.AssetTypes;
var EXAMPLE_ORGANIZATION_ID = '3Qnv2pMAxLZqVdp7n8RZ0x';

// Populate the db with fake data
module.exports = {
    populate: populate
}

function populate() {

    // Cars
    /*
        logs example
        {
            weekOf: 1448168400000,
            createdAt: '2015-11-23T20:55:20.432Z',
            data: {
                mileage: '8421'
            },
            carId: 1
        },
        {
            weekOf: 1448773200000,
            createdAt: '2015-11-23T21:05:36.954Z',
            data: {
                mileage: '12923'
            },
            carId: 1
        }
    */
    var car1x = createExampleCar('Toyota', 'Prius', 2013, 'scratch on left door', true)
    ,   car2x = createExampleCar('Honda', 'Civic', 2012, 'needs new engine', false)
    ,   car3x = createExampleCar('Ford', 'Fusion', 2012, 'needs cleaning', true)
    ,   car4x = createExampleCar('Toyota', 'Corolla', 2015, '', true)
    ,   car5x = createExampleCar('Hyundai', 'Sonata', 2014, 'dent in the rear bumper', true)
    ,   car6x = createExampleCar('Cadillac', 'CT6', 2016, '', true)
    ,   car7x = createExampleCar('Toyota', 'Camry Hybrid', 2015, '', true)
    ,   car8x = createExampleCar('Honda', 'Accord', 2013, '', true)
    ,   car9x = createExampleCar('Mazda', 'Mazda6', 2015, '', true)
    ,   car10x = createExampleCar('Manwë', 'Great Eagle', NaN, 'very convenient', true)
    ;

    var exampleCars = [
        car1x,
        car2x,
        car3x,
        car4x,
        car5x,
        car6x,
        car7x,
        car8x,
        car9x,
        car10x
    ];

    exampleCars.forEach(function(c) {
        Cars.create(c);
    });


    // Drivers
    var driver1x = createExampleDriver('Gandalf', 'the Grey', 'Flexible')
    ,   driver2x = createExampleDriver('Saruman', 'the White', 'PM')
    ,   driver3x = createExampleDriver('Gollum', '', 'PM')
    ,   driver4x = createExampleDriver('Balrog', '', 'PM')
    ,   driver5x = createExampleDriver('Elrond', 'Halfelven', 'PM')
    ,   driver6x = createExampleDriver('Galadriel', '', 'PM')
    ,   driver7x = createExampleDriver('Arwen', 'Evenstar', 'Flexible')
    ;

    var exampleDrivers = [
        driver1x,
        driver2x,
        driver3x,
        driver4x,
        driver5x,
        driver6x,
        driver7x,
    ];

    exampleDrivers.forEach(function(d) {
        Drivers.create(d);
    });

    // Prospects
    ProspectStatuses.create({
        organizationId: EXAMPLE_ORGANIZATION_ID,
        data: {},
        statuses: {
          length: 5,
          0: {
              value: 'Callers'
          },
          1: {
              value: 'Interviewed'
          },
          2: {
              value: 'Waiting List'
          },
          3: {
              value: 'Rejected'
          },
          4: {
              value: 'Unassigned',
              special: true
          },
        }
    });

    var prospect1x = createExampleProspect('Frodo', 'Baggins', 'Callers', 'Flexible')
    ,   prospect2x = createExampleProspect('Samwise', 'Gamgee', 'Callers', 'Flexible')
    ,   prospect3x = createExampleProspect('Legolas', '', 'Callers', 'AM')
    ,   prospect4x = createExampleProspect('Gimli', '', 'Interviewed', 'AM')
    ,   prospect5x = createExampleProspect('Aragorn', '', 'Interviewed', 'PM')
    ,   prospect6x = createExampleProspect('Boromir', '', 'Rejected', 'PM')
    ,   prospect7x = createExampleProspect('Pippin', 'Took', 'Waiting List', 'AM')
    ,   prospect8x = createExampleProspect('Merry', 'Brandybuck', 'Waiting List', 'AM')
    ;

    var exampleProspects = [
        prospect1x,
        prospect2x,
        prospect3x,
        prospect4x,
        prospect5x,
        prospect6x,
        prospect7x,
        prospect8x
    ];

    exampleProspects.forEach(function(p) {
        Prospects.create(p);
    });

    AssetTypes.create({
        organizationId: EXAMPLE_ORGANIZATION_ID,
        data: {},
        types: {
          length: 1,
          0: {
            value: "Fuel Card"
          }
        }
    });
}

function createField(value, dataType, log) {
    var field = {};

    field.value = value ? value : null;
    field.log = !!log;

    switch (dataType) {
        case 'text':
            field.dataType = 'text';
            break;
        case 'number':
            field.dataType = 'number';
            break;
        case 'boolean':
            field.dataType = 'boolean';
            break;
        default:
            throw new Error('Unknown field dataType ' + dataType)
    }

    return field;
}

function randomInt(min, max) {
    if (!min) min = 0
    if (!max) max = 10
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomLetter() {
    var ascii = randomInt(65, 90);
    return String.fromCharCode(ascii);
}

function randomLicensePlate() {
    return 'T' + randomInt(100000, 999999) + randomLetter();
}

function fullName(first, last) {
    return (!last || last.trim() === '') ? first : (first + ' ' + last);
}

function createExampleProspect(firstName, lastName, status, shift) {
    return {
        organizationId: EXAMPLE_ORGANIZATION_ID,
        identifier: "Name",
        status: { value: status },
        data: {
            Name: createField(fullName(firstName, lastName), 'text'),
            'First Name': createField(firstName, 'text'),
            'Last Name': createField(lastName, 'text'),
            status: createField(status, 'text'),
            points: createField(randomInt(), 'number'),
            accidents: createField(randomInt(0, 3), 'number'),
            shift: createField(shift, 'text')
        }
    }
}

function createExampleCar(make, model, year, notes, operational) {
    return {
        organizationId: EXAMPLE_ORGANIZATION_ID,
        identifier: "licensePlate",
        data: {
            licensePlate: createField(randomLicensePlate(), 'text'),
            licenseNumber: createField(randomInt(100000, 999999), 'text'),
            mileage: createField(randomInt(50000, 150000), 'number', true),
            make: createField(make, 'text'),
            model: createField(model, 'text'),
            year: createField(year, 'number'),
            notes: createField(notes, 'text'),
            operational: createField(operational, 'boolean')
        },
        logs: [],
        driversAssigned: []
    }
}

function createExampleDriver(firstName, lastName, shift) {
    var driverData = createExampleProspect(firstName, lastName, null, shift).data;
    delete driverData.status;
    driverData['Revenue'] = createField(randomInt(500, 1500), 'number', true);

    return {
        organizationId: EXAMPLE_ORGANIZATION_ID,
        identifier: "Name",
        data: driverData,
        logs: [],
        carsAssigned: [],
        assetsAssigned: []
    }
}
