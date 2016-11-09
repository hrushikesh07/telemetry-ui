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
                var computeChecks = ['cpu', 'disk', 'memory', 'network', 'check_memory_usage', 'cpu_usages_check', 'memory_metrics', 'memory_usage_check', 'disk_usage_check', 'keepalive', 'load-metrics', 'disk-capacity-metrics'];
                if (!instanceMetrics[instanceId]) {
                    instanceMetrics[instanceId] = {
                        'app': {},
                        'compute': {}
                    };
                    if (computeChecks.indexOf(checkName) !== -1) {
                        instanceMetrics[instanceId]['compute'][checkName] = data;
                    } else {
                        instanceMetrics[instanceId]['app'][checkName] = data;
                    }
                } else {
                    if (computeChecks.indexOf(checkName) !== -1) {
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
