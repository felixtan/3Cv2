'use strict';

/**
 * @ngdoc service
 * @name clientApp.carService
 * @description
 * # carService
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('dataService', function ($state, $http, $q, ENV) {

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

      ////////////////
      //// Assets ////
      ////////////////

      getAssetTypes: function() {
        return $http({
          method: 'GET',
          url: '/api/asset-types',
          params: params
        }).then(function(data) {
          return data;
        }, function(err) {
          console.error(err);
        });
      },

      updateAssetTypes: function(types) {
        return $http({
          method: 'PUT',
          url: '/api/asset-types',
          params: params,
          data: types
        }).then(function(data) {
          $state.forceReload();
          return data;
        }, function(err) {
          $state.forceReload();
          console.error(err);
        });
      },

      getAssets: function() {
        return $http({
          method: 'GET',
          url: '/api/assets',
          params: params
        }).then(function(data) {
          return data;
        }, function(err) {
          console.error(err);
        });
      },

      getAssetsOfType: function(assetType) {
        return $http({
          method: 'GET',
          url: '/api/assets/' + assetType,
          params: params
        }).then(function(data) {
          return data;
        }, function(err) {
          console.error(err);
        });
      },

      getAsset: function(id) {
        return $http.get('/api/assets/' + id)
          .then(function(data) {
            return data;
          }, function(err) {
            console.error(err);
          });
      },

      createAsset: function(asset) {
        return $http.post('/api/assets', asset)
        .then(function(data) {
          $state.forceReload();
          return data;
        }, function(err) {
          $state.forceReload();
          console.error(err);
        });
      },

      updateAsset: function(asset) {
        return $http({
          method: 'PUT',
          url: '/api/assets/' + asset.id,
          params: params,
          data: asset
        }).then(function(data) {
          // $state.forceReload();
          return data;
        }, function(err) {
          $state.forceReload();
          console.error(err);
        });
      },

      deleteAsset: function(id) {
        return $http.delete('/api/assets/' + id)
        .then(function(data) {
          $state.forceReload();
          return data;
        }, function(err) {
          $state.forceReload();
          console.error(err);
        });
      },

      ///////////////
      // Prospects //
      ///////////////

      getProspectStatuses: function() {
        return $http({
          method: 'GET',
          url: '/api/prospect-statuses',
          params: params
        }).then(function(data) {
          return data;
        }, function(err) {
          console.error(err);
        });
      },

      updateProspectStatuses: function(statuses) {
        return $http({
          method: 'PUT',
          url: '/api/prospect-statuses',
          params: params,
          data: statuses
        }).then(function(data) {
          // $state.forceReload();
          return data;
        }, function(err) {
          $state.forceReload();
          console.error(err);
        });
      },

      getProspects: function() {
        return $http({
          method: 'GET',
          url: '/api/prospects',
          params: params
        }).then(function(data) {
          return data;
        }, function(err) {
          console.error(err);
        });
      },

      getProspect: function(id) {
        return $http.get('/api/prospects/' + id)
        .then(function(data) {
          return data;
        }, function(err) {
          console.error(err);
        });
      },

      createProspect: function(prospect) {
        return $http.post('/api/prospects', prospect)
        .then(function(data) {
          $state.forceReload();
          return data;
        }, function(err) {
          $state.forceReload();
          console.error(err);
        });
      },

      updateProspect: function(prospect) {
        return $http({
          method: 'PUT',
          url: '/api/prospects/' + prospect.id,
          params: params,
          data: prospect
        }).then(function(data) {
          $state.forceReload();
          return data;
        }, function(err) {
          $state.forceReload();
          console.error(err);
        });
      },

      deleteProspect: function(id, params) {
        return $http({
          method: 'DELETE',
          url: '/api/prospects/' + id,
          params: params
        })
        .then(function(data) {
          $state.forceReload();
          return data;
        }, function(err) {
          $state.forceReload();
          console.error(err);
        });
      },

      ///////////////
      /// Drivers ///
      ///////////////

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

      createDriver: function(driver) {
        return $http.post('/api/drivers', driver)
          .then(function(data) {
            $state.forceReload();
            return data;
          }, function(err) {
            $state.forceReload();
            console.error(err);
          });
      },

      updateDriver: function(driver) {
        return $http({
          method: 'PUT',
          url: '/api/drivers/' + driver.id,
          params: params,
          data: driver
        }).then(function(data) {
          $state.forceReload();
          return data;
        }, function(err) {
          $state.forceReload();
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
          $state.forceReload();
          return data;
        }, function(err) {
          $state.forceReload();
          console.error(err);
        });
      },

      ////////////
      /// Cars ///
      ////////////

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

      updateCar: function(car) {
        // console.log(car);
        return $http({
          method: 'PUT',
          url: '/api/cars/' + car.id,
          params: params,
          data: car
        })
        .then(function(data) {
          $state.forceReload();
          return data;
        }, function(err) {
          console.error(err);
          $state.forceReload();
        });
      },

      createCar: function(car) {
        return $http.post('/api/cars', car)
          .then(function(data) {
            $state.forceReload();
            return data;
          }, function(err) {
            $state.forceReload();
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
          $state.forceReload();
          return data;
        }, function(err) {
          $state.forceReload();
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
      }
    };
  });
