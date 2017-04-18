(function () {
    'use strict';

    angular.module('app')
            .service('telemetryService', [
                '$q', '$http', 'baseAPIUrl', 'commonService',
                telemetryService
            ]);

    function telemetryService($q, $http, baseAPIUrl, commonService) {

        function fullUrl(relUrl) {
            return baseAPIUrl + relUrl;
        }

        var instanceMetrics = {};

        this.promiseGet = function (url) {
            var deferred = $q.defer();
            $http.get(fullUrl(url))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status) {
                        deferred.reject();
                    });
            return deferred.promise;
        };
        this.promiseOwn = function (paramsObject) {
            return $http(paramsObject);
        };
        this.promisePost = function (paramsObject) {
            var deferred = $q.defer();
            $http.post(fullUrl(paramsObject.url),paramsObject.data)
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function(data) {
                    deferred.reject();
                });
            return deferred.promise;
        };
        this.getAlertHistoryData = function (offset, pageSize, filter, timeFilter) {
            var url = '/alerthistory?orderBy=DESC&limit=' + pageSize + '&offset=' + offset;
            if (filter.significance) {
                url += '&significance=' + filter.significance;
            }
             if (filter.status && filter.status !== '') {
                url += '&checkStatus=' + filter.status;
            }
            if (filter.instance && filter.instance !== '') {
                url += '&instance=' + filter.instance;
            }
            if (filter.checkName && filter.checkName !== '') {
                url += '&checkName=' + filter.checkName;
            }
            if (timeFilter && timeFilter.startTime && filter.startTime !== '') {
                url += '&fromTime=' + commonService.toISOStringFormat(timeFilter.startTime);
            }
            if (timeFilter && timeFilter.endTime && filter.endTime !== '') {
                url += '&toTime=' + commonService.toISOStringFormat(timeFilter.endTime);
            }

            var deferred = $q.defer();
            $http.get(fullUrl(url))
                    .success(function (response) {
                        var data, alertColumns = {}, alerts = [], result = {};
                        if (response.results[0].series) {
                            data = response.results[0].series[0];
                            alertColumns = commonService.toObject(data.columns);
                            angular.forEach(data.values, function (value) {
                                if (value[alertColumns.checkStatus] > 2) {
                                    value[alertColumns.checkStatus] = '3';
                                    value[alertColumns.value] = 3;
                                }
                                alerts.push(value);
                            });
                        }
                        result = {
                            alerts: alerts,
                            alertColumns: alertColumns
                        };
                        deferred.resolve(result);
                    })
                    .error(function (data, status) {
                        deferred.reject();
                    });
            return deferred.promise;
        };
        this.getRemediationData = function (offset, pageSize, filter, timeFilter) {
            var url = '/remediation_history?orderBy=DESC&limit=' + pageSize + '&offset=' + offset;
            if (filter && filter.instance && filter.instance !== '') {
                url += '&instance=' + filter.instance;
            }
            if (timeFilter && timeFilter.startTime && filter.startTime !== '') {
                url += '&fromTime=' + timeFilter.startTime.toISOString();
            }
            if (timeFilter && timeFilter.endTime && filter.endTime !== '') {
                url += '&toTime=' + timeFilter.endTime.toISOString();
            }

            var deferred = $q.defer();
            $http.get(fullUrl(url))
                    .success(function (response) {
                        var data, remediationColumns = {}, remediationData = [], result = {};
                        var data;
                        if (response.results[0].series) {
                            data = response.results[0].series[0];
                            remediationColumns = commonService.toObject(data.columns);
                            remediationData = data.values;
                        }
                        result = {
                            remediationData: remediationData,
                            remediationColumns: remediationColumns
                        };
                        deferred.resolve(result);
                    })
                    .error(function (data, status) {
                        deferred.reject();
                    });
            return deferred.promise;
        };
        this.getCorelationData = function (instance, timeReference) {
            var url = '/corelation?instance=' + instance + '&timeReference=' + timeReference;

            var deferred = $q.defer();
            $http.get(fullUrl(url))
                    .success(function (response) {
                        var data, remediationColumns = {}, remediationData = [], result = {};
                        var data;
                        if (response.remediation.results[0].series) {
                            data = response.remediation.results[0].series[0];
                            remediationColumns = commonService.toObject(data.columns);
                            remediationData = data.values;
                        }
                        result = {
                            remediation: {
                                remediationData: remediationData,
                                remediationColumns: remediationColumns
                            },
                            actionHistory:response.actionHistory
                        };
                        deferred.resolve(result);
                    })
                    .error(function (data, status) {
                        deferred.reject();
                    });
            return deferred.promise;
        };
        this.getInstanceMetrics = function (instanceId) {
            if (instanceMetrics[instanceId]) {
                return instanceMetrics[instanceId];
            } else {
                return false;
            }
        };
        this.updateInstanceMetrics = function (data) {
            var instanceId = data.instanceId;
            var checkName = data.checkName;
            var computeChecks = ['cpu', 'disk', 'memory', 'network', 'check_memory_usage', 'cpu_usages_check', 'memory_metrics', 'memory_usage_check', 'disk_usage_check', 'keepalive', 'load-metrics', 'disk-capacity-metrics','check_load'];
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
        };
    }
})();
