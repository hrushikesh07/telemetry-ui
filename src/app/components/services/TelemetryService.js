(function () {
    'use strict';

    angular.module('app')
        .service('telemetryService', [
            '$q', '$http',
            telemetryService
        ]);

    function telemetryService($q,$http) {
        //var baseAPIUrl = 'http://telemetry.rlcatalyst.com';
        // var baseAPIUrl = 'http://52.88.77.29:8080';
       var baseAPIUrl = 'http://telemetry-api.rlcatalyst.com';
        function fullUrl(relUrl) {
            return baseAPIUrl + relUrl;
        }

        var serviceInterface = {
            promiseGet : function (url) {
                    var deferred = $q.defer();
                $http.get(fullUrl(url))
                    .success(function(data) {
                            deferred.resolve(data);
                    })
                    .error(function(data, status) {
                            deferred.reject();
                    });
                return deferred.promise;
            },
            getRemediationHistory: function () {
                var url = '/remediation_history';
                return $http.get(fullUrl(url));
            }
        };
        return serviceInterface;
    }

})();
