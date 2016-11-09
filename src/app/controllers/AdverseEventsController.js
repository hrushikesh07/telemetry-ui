(function () {

    angular
        .module('app')
        .controller('AdverseEventsController', [
            '$scope', 'telemetryService', 'toastr', 'pageSize', 'commonService',
            AdverseEventsController
        ]);

    function AdverseEventsController($scope, telemetryService, toastr, pageSize, commonService) {

        var filters = {
            status: '',
            instance: ''
        };

        $scope.filter = angular.copy(filters);

        $scope.resetFilter = function () {
            $scope.filter = angular.copy(filters);
            $scope.getAlertHistory();
        };

        $scope.instanceFilter = true;

        $scope.alerts = [];
        $scope.alertColumns = {};

        $scope.alertPage = 1;
        $scope.pageSize = pageSize;

        $scope.numberOfPages = function (allRecords)
        {
            return Math.ceil(allRecords.length / $scope.alertPageSize);
        };

        $scope.resetPage = function () {
            $scope.curPage = 0;
        };

        var urList = '/list_instances';
        telemetryService.promiseGet(urList).then(function (response) {
            $scope.instances = response.messageBody;
        }, function () {
        });
        $scope.getElkLink = function (alertData) {
            var time = alertData[$scope.alertColumns.time];
            var instanceid = alertData[$scope.alertColumns.instanceId];
            var timeStamp = new Date(time);
            var timeStampIso = timeStamp.toISOString();
            var timeStampMinus = new Date(timeStamp.getTime() - (5 * 60 * 1000));
            var timeStampMinusIso = timeStampMinus.toISOString();
            var elkLink = "http://elk.rlcatalyst.com/search/" + instanceid + "/" + timeStampMinusIso + "/" + timeStampIso;
            return encodeURI(elkLink);
        };

        $scope.getAlertHistory = function () {
            $scope.dataloading = true;
            $scope.alerts = [];
            var offset = ($scope.alertPage - 1) * pageSize;
            var url = '/alerthistory?orderBy=DESC&limit=' + pageSize + '&offset=' + offset;
            if ($scope.filter.status && $scope.filter.status !== '') {
                url += '&status=' + $scope.filter.status;
            }
            if ($scope.filter.instance && $scope.filter.instance !== '') {
                url += '&instance=' + $scope.filter.instance;
            }
            telemetryService.promiseGet(url).then(function (response) {

                var data;
                if (response.results[0].series) {
                    data = response.results[0].series[0];
                    $scope.alertColumns = commonService.toObject(data.columns);
                    angular.forEach(data.values, function (value) {
                        if (value[$scope.alertColumns.status] > 2) {
                            value[$scope.alertColumns.status] = 3;
                        }
                        $scope.alerts.push(value);
                    });

                    $scope.dataloading = false;
                } else {
                    $scope.dataloading = false;
                }

            }, function () {

            });
        };
        
        $scope.getAlertPaginationRecord = function(page){
            $scope.alertPage = page;
            $scope.getAlertHistory();
        };

        $scope.$on('alertEvent', function (event, args) {
            var data = args.message;
            data = Object.values(data);
            if (data && $scope.alertPage === 1) {
                var filterCheck = true;
                data[$scope.alertColumns.time] = data[$scope.alertColumns.time] * 1000;
                if (data[$scope.alertColumns.status] > 2) {
                    data[$scope.alertColumns.status] = 3;
                }
                if ($scope.filter.status && $scope.filter.status !== '') {
                    if (data[$scope.alertColumns.status] !== $scope.filter.status) {
                        filterCheck = false;
                    }
                }
                if ($scope.filter.instance && $scope.filter.instance !== '') {
                    if (data[$scope.alertColumns.instance] !== $scope.filter.instance) {
                        filterCheck = false;
                    }
                }
                if (filterCheck) {
                    $scope.alerts.push(data);
                    if ($scope.alerts.length > pageSize) {
                        $scope.alerts = $scope.alerts.slice(-pageSize);
                    }
                    $scope.$apply();
                }
            }

        });

        $scope.$on('listInstancesEvent', function (event, args) {
            var data = args.message, existing;
            for (var i = 0; i < data.length; i++) {
                existing = false;
                for (var j = 0; j < $scope.instances.length; j++) {
                    if (data[i].instanceId === $scope.instances[j].instanceId) {
                        angular.extend($scope.instances[j], data[i]);
                        existing = true;
                        break;
                    }
                }
                if (!existing) {
                    $scope.instances.push(data[i]);
                }
            }
            $scope.$apply();
        });

        function init() {
            $scope.getAlertHistory();
        }
        init();
    }

})();
