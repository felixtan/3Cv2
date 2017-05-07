(function() {
  'use strict';

  angular.module('clientApp')
    .controller('ProspectStatusModalCtrl', ['prospectHelpers', 'prospectStatuses', '$state', '$uibModalInstance',
    function(prospectHelpers, prospectStatuses, $state, $uibModalInstance) {

        var ctrl = this;
        ctrl.newStatus = { value: null };

        ctrl.validForm = function() {
            return ((ctrl.newStatus.value !== null) && (typeof ctrl.newStatus.value !== "undefined"));
        };

        ctrl.submit = function() {
            prospectStatuses.statuses[prospectStatuses.statuses.length++] = ctrl.newStatus;
            prospectHelpers.updateStatuses(prospectStatuses).then(function() {
                $state.forceReload();
                ctrl.close();
            });
        };

        ctrl.reset = function () {
            ctrl.newStatus = { value: null };
        };

        ctrl.close = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);
})();
