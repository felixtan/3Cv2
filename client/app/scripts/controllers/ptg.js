'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:PtgCtrl
 * @description
 * # PtgCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('PtgCtrl', function ($state, $scope, $window, getPtgLogs, basicDriverData, $http) {
    var _ = $window._;
    $scope.logs = getPtgLogs.data.logs; 
    $scope.mostRecentDateInMs = getPtgLogs.data.mostRecentDateInMs;
    $scope.drivers = basicDriverData.data;

    // causes error when 'use strict'
    const oneWeekInMs = 604800000;

    // calculate payout
    // input: driverId from ptgLog
    // output: payout and profit key-value pairs added to the ptgLog object
    this.calculatePayout = function(driverLog) {
        var currentPayout = driverLog.payout;
        
        // minimum condition to calculate
        if(typeof driverLog.uberRevenue === 'number' && typeof driverLog.tollCosts === 'number' && typeof driverLog.gasCosts === 'number') {

            var driver = _.filter($scope.drivers, function(driver) {
                return driverLog.driverId === driver.id;
            });
            
            var newPayout = Math.round((driverLog.uberRevenue - driverLog.tollCosts) * driver[0].payRate*0.01 - driverLog.gasCosts/2);

            if(typeof driverLog.deposit === 'number') { newPayout -= driverLog.deposit; }
            if(typeof driverLog.additions === 'number') { newPayout = newPayout + driverLog.additions; }
            if(typeof driverLog.subtractions === 'number') { newPayout = newPayout - driverLog.subtractions; }
            
            if(currentPayout !== newPayout) {
                driverLog.payout = newPayout;
                $scope.updateLog(driverLog);
            }
        } else {
            console.log('uberRevenue or tollCosts or gasCosts invalid');
        }
    };

    this.calculateProfit = function(driverLog) {
        var currentProfit = driverLog.profit;

        if(typeof driverLog.uberRevenue === 'number' && typeof driverLog.tollCosts === 'number' && typeof driverLog.gasCosts === 'number') {

            var driver = _.filter($scope.drivers, function(driver) {
                return driverLog.driverId === driver.id;
            });
            var newProfit = Math.round((driverLog.uberRevenue - driverLog.tollCosts) * (1-driver[0].payRate*0.01) - driverLog.gasCosts/2 - driverLog.additions);

            if(typeof driverLog.deposit === 'number') { newProfit -= driverLog.deposit; }
            if(typeof driverLog.additions === 'number') { newProfit += driverLog.additions; } 
            if(typeof driverLog.subtractions === 'number') { newProfit -= driverLog.subtractions; }
            
            if(currentProfit !== newProfit) {
                driverLog.profit = newProfit;
                $scope.updateLog(driverLog);
            }
        } else {
            console.log('uberRevenue or tollCosts or gasCosts invalid');
        }
    };

    this.newLog = function() {
        var newDateInMs = $scope.mostRecentDateInMs + oneWeekInMs; 
        var date = new Date(newDateInMs);

        $http.post('/api/logs/ptg', {
            dateInMs: newDateInMs,
            date: date
        }).then(function() {
            setTimeout(function() { $state.forceReload(); }, 1000);
        }).catch(function(err) {
            console.error(err);
        });
    };

     $scope.updateLog = function(driver) {
        $http.put('/api/logs/drivers/' + driver.id, {
            uberRevenue: driver.uberRevenue,
            tollCosts: driver.tollCosts,
            gasCosts: driver.gasCosts,
            deposit: driver.deposit,
            hours: driver.hours,
            acceptRate: driver.acceptRate,
            payout: driver.payout,
            additions: driver.additions,
            subtractions: driver.subtractions,
            profit: driver.profit
        }).success(function() {
        }).error(function(err) {
            console.error(err);
        });
    };


  });
