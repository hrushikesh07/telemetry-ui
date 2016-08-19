(function () {
    'use strict';

    angular.module('app')
        .service('telemetryService', [
            '$q', '$http',
            telemetryService
        ]);

    function telemetryService($q,$http) {
        var baseAPIUrl = 'http://telemetry.rlcatalyst.com';
        function fullUrl(relUrl) {
            return baseAPIUrl + relUrl;
        }
        var serviceInterface = {
            getAccount: function () {
                var url = '/accounts';
                return $http.get(fullUrl(url));
            },
            getCatsEye: function () {
                var url = '/catseye';
                return $http.get(fullUrl(url));
            },
            getListInstances: function () {
                var url = '/list_instances';
                return $http.get(fullUrl(url));
            },
            getAlertHistory: function () {
                var url = '/alerthistory';
                return $http.get(fullUrl(url));
            },
            getRemediationHistory: function () {
                var url = '/remediation_history';
                return $http.get(fullUrl(url));
            }
        };
        return serviceInterface;
    }

})();
