'use strict';

/**
 * @ngdoc directive
 * @name clientApp.directive:validFunction
 * @description
 * # validFunction
 */
angular.module('clientApp')
  .directive('validFunction', function () {
    return {
        // require: 'ngModel',
        // restrict: 'A',
        // link: function (scope, element, attrs, mCtrl) {
        //     // element.text('this is the validFunction directive');
        //     mCtrl.$parsers.push(scope.validFunction);
        // }
    };
  });
