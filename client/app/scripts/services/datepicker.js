(function() {
  'use strict';

  /**
   * @ngdoc service
   * @name clientApp.datePicker
   * @description
   * # datePicker
   * Factory in the clientApp.
   */
  angular.module('clientApp')
    .factory('datepicker', function () {
      // Datepicker

      // error when using const and 'use strict'
      var oneWeekInMs = 604800000;
      var oneDayInMs = 86400000;
      var dt = new Date();
      var minDate = null;
      var maxDate = new Date(dt.getFullYear()+1, dt.getMonth()+1);    // Allows for a year in advance
      var status = { opened: false };
      var formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      var format = formats[0];
      var tomorrow = new Date(dt.getTime()+oneDayInMs);
      var afterTomorrow = new Date(dt.getTime()+oneDayInMs*2);
      var events = [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
          ];
      var dateOptions = {
            formatYear: 'yy',
            startingDay: 0
          };

      // Public API here
      return {
        // methods
        getStartingDay: getStartingDay,
        getStartingDayNum: getStartingDayNum,
        setStartingDay: setStartingDay,
        today: today,
        clear: clear,
        disabled: disabled,
        toggleMin: toggleMin,
        open: open,
        setDate: setDate,
        getDayClass: getDayClass,

        // variables
        dt: dt,
        minDate: minDate,
        maxDate: maxDate,
        status: status,
        format: format,
        tomorrow: tomorrow,
        afterTomorrow: afterTomorrow,
        events: events,
        dateOptions: dateOptions
      };

      function getStartingDayNum() {
          return dateOptions.startingDay;
      }

      function setStartingDay(n) {
        if(n >= 0 && n <= 6) {
          dateOptions.startingDay = n;
        } else {
          throw (new Error('Invalid starting day'));
        }
      }

      function getStartingDay() {
          let day = null;
          switch(getStartingDayNum()) {
              case 0:
                  day = 'Sunday';
                  break;
              case 1:
                  day = 'Monday';
                  break;
              case 2:
                  day = 'Tuesday';
                  break;
              case 3:
                  day = 'Wednesday';
                  break;
              case 4:
                  day = 'Thursday';
                  break;
              case 5:
                  day = 'Friday';
                  break;
              case 6:
                  day = 'Saturday';
                  break;
              default:
                  day = 'Invalid day';
          }

          return day;
      }

      function today() {
          dt = new Date();
      }
      // today();

      function clear() {
          dt = null;
      }

      // // Disable weekend selection
      function disabled(date, mode) {
          return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
      }

      function toggleMin() {
          minDate = minDate ? null : new Date();
      }
      // // toggleMin();

      function open($event) {
          status.opened = true;
      }

      function setDate(year, month, day) {
          dt = new Date(year, month, day);
      }

      function getDayClass(date, mode) {
          if (mode === 'day') {
              var dayToCheck = new Date(date).setHours(0,0,0,0);

              for(var i=0;i<events.length;i++){
                  var currentDay = new Date(events[i].date).setHours(0,0,0,0);

                  if (dayToCheck === currentDay) {
                      return events[i].status;
                  }
              }
          }

          return '';
      }
      // End datepicker stuff
    });
})();
