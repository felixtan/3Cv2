'use strict';

/**
 * @ngdoc directive
 * @name clientApp.directive:repeatFinished
 * @description
 * # repeatFinished
 */
angular.module('clientApp')
  .directive('repeatFinished', function () {
    return function(scope) {
        if(scope.$last && scope.status === scope.prospectStatuses[scope.prospectStatuses.length-1]) {
            scope.$emit('repeatFinished');
        }
    }
  });
