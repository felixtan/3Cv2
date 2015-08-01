'use strict';

/**
 * @ngdoc service
 * @name clientApp.ptgLogPeriodService
 * @description
 * # ptgLogPeriodService
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('ptgLogSettingsService', function () {

    // PTG Log Settings
    var settings = {
      ptgLog: {
        period: {
          value: 1,
          unit: 'week'
        }
      }
    };

    /**
     * Defines the period with which new instances of driverLog are created for each driver.
     * default: 1 week
     */
    // settings.ptgLog.period.value = 1;
    // settings.ptgLog.period.unit = 'week';

    // Public API here
    return {
      getSettings: function () {
        return settings;
      },

      setSettings: function (newSettings) {
        settings = newSettings;
      }
    };
  });
