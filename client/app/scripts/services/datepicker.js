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
    var ONE_DAY_IN_MS = 86400000,
        dt = new Date(),
        minDate = null,
        maxDate = new Date(dt.getFullYear()+1, dt.getMonth()+1),    // Allows for a year in advance
        status = { opened: false },
        formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'],
        format = formats[0],
        tomorrow = new Date(dt.getTime()+ONE_DAY_IN_MS),
        afterTomorrow = new Date(dt.getTime()+ONE_DAY_IN_MS*2),
        events = [
          {
              date: tomorrow,
              status: 'full'
          },
          {
              date: afterTomorrow,
              status: 'partially'
          }
        ],
        dateOptions = {
          formatYear: 'yy',
          startingDay: 0
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
        switch(getStartingDayNum()) {
            case 0:
                return 'Sunday';
                break;
            case 1:
                return 'Monday';
                break;
            case 2:
                return 'Tuesday';
                break;
            case 3:
                return 'Wednesday';
                break;
            case 4:
                return 'Thursday';
                break;
            case 5:
                return 'Friday';
                break;
            case 6:
                return 'Saturday';
                break;
            default:
                return 'Invalid day';
        }
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

    function open(event) {
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
  });
