(function () {
    'use strict';

    angular.module('app')
        .service('telemetryService', [
            '$q', '$http', 'baseAPIUrl',
            telemetryService
        ]);

    function telemetryService($q, $http, baseAPIUrl) {

        function fullUrl(relUrl) {
            return baseAPIUrl + relUrl;
        }

        var instanceMetrics = {};

        var serviceInterface = {
            promiseGet: function (url) {
                var deferred = $q.defer();
                $http.get(fullUrl(url))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status) {
                        deferred.reject();
                    });
                return deferred.promise;
            },
            getRemediationHistory: function () {
                var url = '/remediation_history';
                return $http.get(fullUrl(url));
            },
            getInstanceMetrics: function (instanceId) {
                if (instanceMetrics[instanceId]) {
                    return instanceMetrics[instanceId];
                } else {
                    return false;
                }
            },
            updateInstanceMetrics: function (data) {
                var instanceId = data.instanceId;
                var checkName = data.checkName;
                if (!instanceMetrics[instanceId]) {
                    instanceMetrics[instanceId] = {
                        'app': {},
                        'compute': {}
                    };
                    if (checkName === 'cpu' || checkName === 'disk' || checkName === 'memory' || checkName === 'network') {
                        instanceMetrics[instanceId]['compute'][checkName] = data;
                    } else {
                        instanceMetrics[instanceId]['app'][checkName] = data;
                    }
                } else {
                    if (checkName === 'cpu' || checkName === 'disk' || checkName === 'memory' || checkName === 'network') {
                        instanceMetrics[instanceId]['compute'][checkName] = data;
                    } else {
                        instanceMetrics[instanceId]['app'][checkName] = data;
                    }
                }
            }
        };
        return serviceInterface;
    }

})();
