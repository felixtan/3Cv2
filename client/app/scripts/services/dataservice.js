'use strict';

/**
 * @ngdoc service
 * @name clientApp.carService
 * @description
 * # carService
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('dataService', function ($http, $q, ENV) {

    // testing with account with organizatinId 3Qnv2pMAxLZqVdp7n8RZ0x
    var params = (ENV.name === ('production' || 'staging')) ? {} : { organizationId: '3Qnv2pMAxLZqVdp7n8RZ0x' };

    // Learning
    // This results in false
    // console.log(ENV.name === ('production' || 'staging'));
    // 
    // This results in 'staging'
    // console.log(ENV.name === 'production' || 'staging');

    // Public API here
    return {

      getDrivers: function() {
        return $http({
          method: 'GET',
          url: '/api/drivers',
          params: params
        }).then(function(data) {
          return data;
        }, function(err) {
          console.error(err);
          throw err;
        });
      },

      getDriver: function (id) {
        return $http.get('/api/drivers/' + id)
          .then(function(data) {
            return data;
          }, function(err) {
            console.error(err);
          });
      },

      getCars: function () {
        return $http({
            method: 'GET',
            url: '/api/cars',
            params: params
          })
          .then(function(data) {
            return data;
          }, function(err) {
            console.error(err);
            throw err;
          });
      },

      getCar: function (id) {
        return $http.get('/api/cars/' + id)
          .then(function(data) {
            return data;
          }, function(err) {
            console.error(err);
          });
      },

      getCarProperties: function () {
        return $http.get('/api/settings/cars', params)
          .then(function(data) {
            return data;
          }, function(err) {
            console.error(err);
          });
      },

      getGasCards: function() {
        return $http.get('/api/assets/gas-cards', params)
          .then(function(data) {
            return data;
          }, function(err) {
            console.error(err);
          });
      },

      getEzPasses: function() {
        return $http.get('/api/assets/ez-passes', params)
          .then(function(data) {
            return data;
          }, function(err) {
            console.error(err);
          });
      },

      getProspects: function() {
        return $http.get('/api/prospects', params)
          .then(function(data) {
            return data;
          }, function(err) {
            console.error(err);
          });
      },

      updateCar: function(car, params) {
        return $http({
          method: 'PUT',
          url: '/api/cars/' + car.id,
          params: params,
          data: car
        })
        .then(function(data) {
          return data;
        }, function(err) {
          console.error(err);
        });
      },

      createCar: function(car) {
        return $http.post('/api/cars', car)
          .then(function(data) {
            return data;
          }, function(err) {
            console.error(err);
          });
      },

      createDriver: function(driver) {
        return $http.post('/api/drivers', driver)
          .then(function(data) {
            return data;
          }, function(err) {
            console.error(err);
          });
      },

      updateDriver: function(driver, params) {
        return $http({
          method: 'PUT',
          url: '/api/drivers/' + driver.id,
          params: params,
          data: driver
        })
        .then(function(data) {
          return data;
        }, function(err) {
          console.error(err);
        });
      },

      deleteCar: function(id, params) {
        return $http({
          method: 'DELETE',
          url: '/api/cars/' + id,
          params: params
        })
        .then(function(data) {
          return data;
        }, function(err) {
          console.error(err);
        });
      },

      deleteDriver: function(id, params) {
        return $http({
          method: 'DELETE',
          url: '/api/drivers/' + id,
          params: params
        })
        .then(function(data) {
          return data;
        }, function(err) {
          console.error(err);
        });
      }
    };
  });
