(function () {

    angular
            .module('app')
            .controller('AdverseEventsController', [
                '$scope', 'telemetryService', 'toastr', 'pageSize', 'commonService', '$stateParams',
                AdverseEventsController
            ]);

    function AdverseEventsController($scope, telemetryService, toastr, pageSize, commonService, $stateParams) {

        $scope.currentView = 'adverse';

        var filters = {
            status: '',
            significance: true,
            instance: '',
            checkName: ''
        };
        $scope.corelation = false;

        $scope.filter = angular.copy(filters);
        
        $scope.selectedInstance = { value: {} }

        if ($stateParams.instanceId) {
            $scope.filter.instance = $stateParams.instanceId;
        }

        $scope.resetFilter = function () {
            $scope.selectedInstance.value = {};
            $scope.filter = angular.copy(filters);
            $scope.alertPage = 1;
            if ($stateParams.instanceId) {
                $scope.filter.instance = $stateParams.instanceId;
            }
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

        var urList = '/instances';
        telemetryService.promiseGet(urList).then(function (response) {
            $scope.instances = response;
        }, function () {
        });
        $scope.getElkLink = function (alertData) {
            var time = alertData[$scope.alertColumns.time];
            var instanceid = alertData[$scope.alertColumns.instanceId];
            return commonService.getElkLink(time, instanceid);
        };

        $scope.getAlertHistory = function (resetPage) {
            if (resetPage) {
                $scope.alertPage = 1;
            }
            $scope.alertsLoading = true;
            $scope.alerts = [];
            var offset = ($scope.alertPage - 1) * pageSize;
            if($scope.selectedInstance.value.id){
                $scope.filter.instance = $scope.selectedInstance.value.id;
            }
            telemetryService.getAlertHistoryData(offset, pageSize, $scope.filter).then(function (response) {
                console.log(response);
                $scope.alerts = response.alerts;
                $scope.alertColumns = response.alertColumns;
                $scope.alertsLoading = false;
            }, function () {
                $scope.alertsLoading = false;
            });
        };

        $scope.getAlertPaginationRecord = function (page) {
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
