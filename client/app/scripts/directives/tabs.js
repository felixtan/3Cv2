(function() {
  angular.module('clientApp').directive('ObjectTab', [function() {
    return {
      restrict: "E",
      scope: {},
      template: `tab ng-repeat='tab in tabs' heading='Thing'></tab>`
    }
  }])
})()
