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
    getAssets;

beforeEach(function() {
    driver1 = {
    id: 1,
    organizationId: '3Qnv2pMAxLZqVdp7n8RZ0x',
    identifier: 'fullName',
    data: {
      "First Name": {
        value: "John",
        log: false
      },
      "Last Name": {
        value: "Doe",
        log: false
      },
      fullName: {
        value: "John Doe",
        log: false
      },
      revenue: {
        value: 1600,
        log: true
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
        log: false
      },
      "Last Name": {
        value: "Wayne",
        log: false
      },
      fullName: {
        value: 'Jane Wayne',
        log: false
      },
      revenue: {
        value: 1600,
        log: true
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
              log: false
          },
          licenseNumber: {
              value: 'GPJ 6478',
              log: false
          },
          mileage: {
              value: '14081',
              log: true
          },
          description: {
              value: 'lorem ipsum',
              log: false
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
          log: false
      },
      licenseNumber: {
          value: 'FLJ 6290',
          log: false
      },
      mileage: {
          value: '120461',
          log: true
      },
      description: {
          value: 'lorem ipsum',
          log: false
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
            log: false
          },
          "Last Name": {
            value: "Grey",
            log: false
          },
          fullName: {
            value: 'Gandalf Grey',
            log: false
          },
          accidents: {
            value: 2,
            log: false
          },
          status: {
            value: 'Callers',
            log: false
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
            log: false
          },
          "Last Name": {
            value: "White",
            log: false
          },
          fullName: {
            value: 'Saruman White',
            log: false
          },
          accidents: {
            value: 0,
            log: false
          },
          status: {
            value: 'Interviewed',
            log: false
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
                log: false
            },
            "Number": {
                value: 1234,
                log: false
            },
            "Balance": {
                value: 33.20,
                log: true
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
                log: false
            },
            "Number": {
                value: 5678,
                log: false
            },
            "Balance": {
                value: 101.41,
                log: true
            }
        },
        logs: [],
        driversAssigned: []
    };

    getAsset = { data: asset1 };
    getAssets = { data: [asset1, asset2] };
});

