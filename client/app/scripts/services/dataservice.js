(function() {
  'use strict';

  /**
   * @ngdoc service
   * @name clientApp.dataService
   * @description
   * # dataService
   * Factory in the clientApp.
   */
  angular.module('clientApp')
    .factory('dataService', ['$state', '$http', '$q', 'ENV', function ($state, $http, $q, ENV) {

      // testing with account with organizatinId 3Qnv2pMAxLZqVdp7n8RZ0x
      var params = (ENV.name === ('production' || 'staging')) ? {} : { organizationId: '3Qnv2pMAxLZqVdp7n8RZ0x' };
      var apiHost = (ENV.name === ('production' || 'staging')) ? 'https://www.fleetly-herokuapp.com/api/' : 'http://localhost:3000/api/';

      // Learning
      // This results in false
      // console.log(ENV.name === ('production' || 'staging'));
      //
      // This results in 'staging'
      // console.log(ENV.name === 'production' || 'staging');

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
        // console.log(method, resource, data, url)
        if (data !== undefined && data !== null) {
          if (method === 'GET' && resource === 'assets' ||
              method === 'GET' && resource === 'prospects' ||
              method === 'GET' && resource === 'drivers' ||
              method === 'GET' && resource === 'cars') {
            return (url + '/' + data)
          } else if (method === 'PUT' && resource === 'assets' ||
                     method === 'DELETE' && resource === 'assets' ||
                     method === 'PUT' && resource === 'prospects' ||
                     method === 'DELETE' && resource === 'prospects' ||
                     method === 'PUT' && resource === 'drivers' ||
                     method === 'DELETE' && resource === 'drivers' ||
                     method === 'PUT' && resource === 'cars' ||
                     method === 'DELETE' && resource === 'cars') {
            return (url + '/' + data.id)
          }
        } else {
          return url
        }
      }

      function sendData(method, resource) {
        // return (resource === 'asset-types' && method === 'PUT' ||
        //         resource === 'assets' && method === 'POST' ||
        //         resource === 'assets' && method === 'PUT' ||
        //         resource === 'prospect-statuses' && method === 'PUT' ||
        //         resource === 'prospects' && method === 'POST' ||
        //         resource === 'prospects' && method === 'PUT' ||
        //         resource === 'drivers' && method === 'POST' ||
        //         resource === 'drivers' && method === 'PUT' ||
        //         resource === 'cars' && method === 'POST' ||
        //         resource === 'cars' && method === 'PUT')

        return method === 'POST' || method === 'PUT'
      }

      function req(method, resource) {
        return function(data) {
          const url = apiHost + resource;
          return $http({
            method: method,
            url: appendDataToUrl(method, resource, data, url),
            params: params,
            data: sendData(method, resource) ? data : null,
          }).then(result => {
            forceReload(method, resource)
            return result;
          }, err => {
            forceReload(method, resource)
            console.error(err);
          });
        };
      }

      // Public API here
      return {

        ////////////////
        //// Assets ////
        ////////////////
        getAssetTypes: req('GET', 'asset-types'),
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
