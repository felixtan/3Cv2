var driver1, 
    driver2, 
    getDriver, 
    getDrivers,

    car1,
    car2,
    getCar,
    getCars,

    prospect1,
    prospect2,
    getProspect,
    getProspects,

    asset1,
    asset2,
    getAsset,
    getAssets,

    randomObjectType;

beforeEach(function() {
    randomObjectType = function() {
      var num = Math.floor(Math.random() * 5);
      switch(num) {
        case 0:
          return 'car';
          break;
        case 1:
          return 'driver';
          break;
        case 2:
          return 'prospect';
          break;
        case 3:
          return 'asset';
          break;
        default:
          return 'foo';
          break;
      }
    };

    driver1 = {
    id: 1,
    organizationId: '3Qnv2pMAxLZqVdp7n8RZ0x',
    identifier: 'fullName',
    data: {
      "First Name": {
        value: "John",
        log: false,
        type: 'text',
        dataType: 'text'
      },
      "Last Name": {
        value: "Doe",
        log: false,
        type: 'text',
        dataType: 'text'
      },
      fullName: {
        value: "John Doe",
        log: false,
        type: 'text',
        dataType: 'text'
      },
      revenue: {
        value: 1600,
        log: true,
        type: 'number',
        dataType: 'number'
      }
    },
    logs: [
      {
        weekOf: 1448168400000,
        data: {
          revenue: 1540
        },
        driverId: 1
      },
      {
        weekOf: 1448773200000,
        data: {
          revenue: 1600
        },
        driverId: 1
      }
    ],
    carsAssigned: [],
    assetsAssigned: []
  };

  driver2 = {
    id: 2,
    organizationId: '3Qnv2pMAxLZqVdp7n8RZ0x',
    identifier: 'fullName',
    data: {
      "First Name": {
        value: "Jane",
        log: false,
        type: 'text',
        dataType: 'text'
      },
      "Last Name": {
        value: "Wayne",
        log: false,
        type: 'text',
        dataType: 'text'
      },
      fullName: {
        value: 'Jane Wayne',
        log: false,
        type: 'text',
        dataType: 'text'
      },
      revenue: {
        value: 1600,
        log: true,
        type: 'number',
        dataType: 'number'
      }
    },
    logs: [
      {
        weekOf: 1448168400000,
        data: {
          revenue: 1557
        },
        driverId: 2
      },
      {
        weekOf: 1448773200000,
        data: {
          revenue: 1600
        },
        driverId: 2
      }
    ],
    carsAssigned: [],
    assetsAssigned: []
  };

  getDriver = { data: driver1 };
  getDrivers = { data: [driver1, driver2] };

  car1 = {
    id: 1,
    identifier: 'licensePlate',
    organizationId: '3Qnv2pMAxLZqVdp7n8RZ0x',
    data: {
        licensePlate: {
              value: 'T627067C',
              log: false,
              type: 'text',
              dataType: 'text'
          },
          licenseNumber: {
              value: 'GPJ 6478',
              log: false,
              type: 'text',
              dataType: 'text'
          },
          mileage: {
              value: '14081',
              log: true,
              type: 'number',
              dataType: 'number'
          },
          description: {
              value: 'lorem ipsum',
              log: false,
              type: 'text',
              dataType: 'text'
          },
          testExpression: {
              value: null,
              log: false,
              type: 'function',
              dataType: 'number',
              expressionItems: [
                {

                }
              ]
          }
    },
    logs: [
        {
            weekOf: 1448168400000,
            createdAt: '2015-11-23T20:55:20.432Z',
            data: {
                mileage: '9412'
            },
            carId: 1
        },
        {
            weekOf: 1448773200000,
            createdAt: '2015-11-23T21:05:36.954Z',
            data: {
                mileage: '14081'
            },
            carId: 1
        }
    ],
    driversAssigned: []
  };

  car2 = {
    id: 2,
    organizationId: '3Qnv2pMAxLZqVdp7n8RZ0x',
    identifier: 'licensePlate',
    data: {
      licensePlate: {
          value: 'T657227C',
          log: false,
          type: 'text',
          dataType: 'text'
      },
      licenseNumber: {
          value: 'FLJ 6290',
          log: false,
          type: 'text',
          dataType: 'text'
      },
      mileage: {
          value: '120461',
          log: true,
          type: 'number',
          dataType: 'number'
      },
      description: {
          value: 'lorem ipsum',
          log: false,
          type: 'text',
          dataType: 'text'
      }
    },
    logs: [
      {
          weekOf: 1448168400000,
          createdAt: '2015-11-23T20:55:20.432Z',
          data: {
              mileage: '100461'
          },
          carId: 2
      },
      {
          weekOf: 1448773200000,
          createdAt: '2015-11-23T21:05:36.954Z',
          data: {
              mileage: '120461'
          },
          carId: 2
      }
    ],
    driversAssigned: []
    };

    getCar = { data: car1 };
    getCars = { data: [car1, car2] };

    prospect1 = {
        id: 1,
        identifier: 'fullName',
        status: 'Callers',
        organizationId: '3Qnv2pMAxLZqVdp7n8RZ0x',
        data: {
          "First Name": {
            value: "Gandalf",
            log: false,
            type: 'text',
            dataType: 'text'
          },
          "Last Name": {
            value: "Grey",
            log: false,
            type: 'text',
            dataType: 'text'
          },
          fullName: {
            value: 'Gandalf Grey',
            log: false,
            type: 'text',
            dataType: 'text'
          },
          accidents: {
            value: 2,
            log: false,
            type: 'number',
            dataType: 'number'
          },
          status: {
            value: 'Callers',
            log: false,
            type: 'text',
            dataType: 'text'
          }
        }
    };

    prospect2 = {
        id: 2,
        identifier: 'fullName',
        status: 'Interviewed',
        organizationId: '3Qnv2pMAxLZqVdp7n8RZ0x',
        data: {
          "First Name": {
            value: "Saruman",
            log: false,
            type: 'text',
            dataType: 'text'
          },
          "Last Name": {
            value: "White",
            log: false,
            type: 'text',
            dataType: 'text'
          },
          fullName: {
            value: 'Saruman White',
            log: false,
            type: 'text',
            dataType: 'text'
          },
          accidents: {
            value: 0,
            log: false,
            type: 'number',
            dataType: 'number'
          },
          status: {
            value: 'Interviewed',
            log: false,
            type: 'text',
            dataType: 'text'
          }
        }
    };

    getProspect = { data: prospect1 };
    getProspects = { data: [prospect1, prospect2] };

    asset1 = {
        id: 1,
        organizationId: '3Qnv2pMAxLZqVdp7n8RZ0x',
        identifier: 'Number',
        assetType: 'Gas Card',
        data: {
            assetType: {
                value: 'Gas Card',
                log: false,
                type: 'text',
                dataType: 'text'
            },
            "Number": {
                value: 1234,
                log: false,
                type: 'text',
                dataType: 'text'
            },
            "Balance": {
                value: 33.20,
                log: true,
                type: 'number',
                dataType: 'number'
            }
        },
        logs: [],
        driversAssigned: []
    };

    asset2 = {
        id: 1,
        organizationId: '3Qnv2pMAxLZqVdp7n8RZ0x',
        identifier: 'Number',
        assetType: 'EZ Pass',
        data: {
            assetType: {
                value: 'EZ Pass',
                log: false,
                type: 'text',
                dataType: 'text'
            },
            "Number": {
                value: 5678,
                log: false,
                type: 'text',
                dataType: 'text'
            },
            "Balance": {
                value: 101.41,
                log: true,
                type: 'number',
              dataType: 'number'
            }
        },
        logs: [],
        driversAssigned: []
    };

    getAsset = { data: asset1 };
    getAssets = { data: [asset1, asset2], type: 'Gas Card' };
});

