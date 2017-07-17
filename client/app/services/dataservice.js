(function() {
  'use strict';

  angular.module('clientApp')
    .factory('dataService', ['$state', '$http', '$q', 'ENV', function ($state, $http, $q, ENV) {

      var params = { organizationId: ENV.organizationId };
      var apiUrl = ENV.apiUrl;

      function forceReload(method, resource) {
        if (method === 'PUT' && resource === 'asset-types' ||
            method === 'POST' && resource === 'assets' ||
            method === 'PUT' && resource === 'assets' ||
            method === 'DELETE' && resource === 'assets' ||
            method === 'PUT' && resource === 'prospect-statuses' ||
            method === 'POST' && resource === 'prospects' ||
            method === 'PUT' && resource === 'prospects' ||
            method === 'DELETE' && resource === 'prospects' ||
            method === 'POST' && resource === 'drivers' ||
            method === 'PUT' && resource === 'drivers' ||
            method === 'DELETE' && resource === 'drivers' ||
            method === 'POST' && resource === 'cars' ||
            method === 'PUT' && resource === 'cars' ||
            method === 'DELETE' && resource === 'cars') {
          $state.forceReload();
        }
      }

      function appendDataToUrl(method, resource, data, url) {
        if (method !== 'POST' && data !== undefined && data !== null) {
          if (method === 'GET') {
                return url + "/" + data
          } else if (method === 'PUT' || method === 'DELETE') {
            if (resource === 'prospects') {
              if (typeof data === 'object') {
                return url + "/" + data.id
              } else {
                return url + "/" + data
              }
            } else if (resource === 'prospect-statuses' || resource === 'asset-types' ) {
              return url
            } else {
              return url + "/" + data.id
            }
          }
        } else {
          return url
        }
      }

      function sendData(method, resource) {
        return method === 'POST' || method === 'PUT'
      }

      function req(method, resource) {
        return function(data) {
          var url = appendDataToUrl(method, resource, data, (apiUrl + resource));

          return $http({
            method: method,
            url: url,
            params: params,
            data: (sendData(method, resource) ? data : null),
          }).then(function(result) {
              return result;
          }, function(err) {
              console.error(err);
          });
        };
      }

      // API
      return {

        ////////////////
        //// Assets ////
        ////////////////
        getTypes: req('GET', 'asset-types'),
        updateAssetTypes: req('PUT', 'asset-types'),
        getAssets: req('GET', 'assets'),
        getAssetsOfType: req('GET', 'assets'),
        getAsset: req('GET', 'assets'),
        createAsset: req('POST', 'assets'),
        updateAsset: req('PUT', 'assets'),
        deleteAsset: req('DELETE', 'assets'),

        ///////////////
        // Prospects //
        ///////////////
        getProspectStatuses: req('GET', 'prospect-statuses'),
        updateProspectStatuses: req('PUT', 'prospect-statuses'),
        getProspects: req('GET', 'prospects'),
        getProspect: req('GET', 'prospects'),
        createProspect: req('POST', 'prospects'),
        updateProspect: req('PUT', 'prospects'),
        deleteProspect: req('DELETE', 'prospects'),

        ///////////////
        /// Drivers ///
        ///////////////
        getDrivers: req('GET', 'drivers'),
        getDriver: req('GET', 'drivers'),
        createDriver: req('POST', 'drivers'),
        updateDriver: req('PUT', 'drivers'),
        deleteDriver: req('DELETE', 'drivers'),

        ////////////
        /// Cars ///
        ////////////
        getCars: req('GET', 'cars'),
        getCar: req('GET', 'cars'),
        createCar: req('POST', 'cars'),
        updateCar: req('PUT', 'cars'),
        deleteCar: req('DELETE', 'cars'),
      };
    }]);
})();
