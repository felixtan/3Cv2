'use strict';

/**
 * @ngdoc service
 * @name clientApp.carHelpers
 * @description
 * # carHelpers
 * Factory in the clientApp.
 */
angular.module('clientApp')
    .factory('objectHelpers', function (ENV, $q, dataService, $state) {
        var simplify = function(objects) {
            return _.map(objects, function(object) {
                return {
                    id: object.id,
                    identifierValue: object.data[object.identifier].value,
                    assetType: object.assetType || null,
                };
            });
        };

        var simplifyOne = function(object) {
            return {
                id: object.id,
                identifierValue: object.data[object.identifier].value,
                assetType: object.assetType || null,
            };
        };

        return {
            simplify: simplify,
            simplifyOne: simplifyOne,
        }
    });