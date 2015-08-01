'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('SettingsCtrl', function (settings) {
    this.ptgLog = settings.ptgLog;
    
    this.apply = function() {
        settings.setSettings(this.settings);
    }
  });
