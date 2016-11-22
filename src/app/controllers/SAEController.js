(function () {

    angular
        .module('app', ['nvd3', 'calHeatmap'])
        .controller('SAEController', [
            '$scope', '$stateParams', 'telemetryService', 'commonService', 'saePageSize', '$filter', SAEController
        ]);
    function SAEController($scope, $stateParams, telemetryService, commonService, saePageSize, $filter) {
        $scope.currentView = 'sae';
        $scope.instanceId = $stateParams.instanceId;
        $scope.alerts = [];
        $scope.remediationData = [];
        $scope.alertColumns = {};
        $scope.aggregationColumns = {};
        $scope.remediationColumns = {};
        $scope.alertPage = 1;
        $scope.remediationPage = 1;
        $scope.pageSize = saePageSize;
        $scope.calData = {};
        $scope.timeFilter = null;

        $scope.graphTitle = 'Events Data';
        $scope.graphType = 'Monthly Critical Events';


        $scope.eventsLoading = true;
        $scope.alertsLoading = true;
        $scope.remediationLoading = true;
        
        var startDate = commonService.addMonths(new Date(), -3);

        $scope.getAllInstances = function () {
            var urList = '/list_instances';
            telemetryService.promiseGet(urList).then(function (response) {
                $scope.instances = response.messageBody;
                if (!$scope.instanceId) {
                    $scope.instanceId = $scope.instances[0].instanceId;
                    $scope.getEventsData();
                    $scope.getAlertHistory();
                    $scope.getRemediationData();
                }
            }, function () {
            });
        };

        $scope.getInstanceData = function () {
            $scope.getEventsData();
            $scope.getAlertHistory();
            $scope.getRemediationData();
        };


        $scope.calClickEvent = function (date, nb) {
            $scope.timeFilter = commonService.getStartEndTime(date);
            $scope.alertPage = 1;
            $scope.remediationPage = 1;
            $scope.getAlertHistory();
            $scope.getRemediationData();
        };

        $scope.showAll = function(){
            $scope.timeFilter = null;
            $scope.alertPage = 1;
            $scope.remediationPage = 1;
            $scope.getAlertHistory();
            $scope.getRemediationData();
        };
        
        $scope.calConfig = {data: {}, start: startDate, domain: 'month', rowLimit: 4, range: 4, cellSize: 30, onClick: $scope.calClickEvent};



        $scope.getEventsData = function () {
            $scope.eventsLoading = true;
            $scope.calConfig.data = {}
            var date = new Date();
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            var fromTime = firstDay.toISOString();
            var toTime = date.toISOString();
            var url = '/analytics/alert/aggregate?status=2&instance=' + $scope.instanceId + '&frequency=1_DAY&fromTime=' + fromTime + '&toTime=' + toTime;
            telemetryService.promiseGet(url).then(function (response) {

                var data;
                if (response.results[0].series) {
                    data = response.results[0].series[0];
                    $scope.aggregationColumns = commonService.toObject(data.columns);
                    angular.forEach(data.values, function (value) {
                        var time = value[$scope.aggregationColumns.time];
                        var date = new Date(time);
                        var timeStamp = date.getTime() / 1000;
                        var val = value[$scope.aggregationColumns.value];
                        $scope.calConfig.data[timeStamp] = val;
                    });
                    $scope.eventsLoading = false;
                } else {
                    $scope.eventsLoading = false;
                }

            }, function () {

            });
        };




        $scope.getElkLink = function (alertData) {
            var time = alertData[$scope.alertColumns.time];
            var instanceid = alertData[$scope.alertColumns.instanceId];
            return commonService.getElkLink(time, instanceid);
        };

        $scope.getAlertHistory = function () {
            $scope.alerts = [];
            $scope.alertsLoading = true;
            var offset = ($scope.alertPage - 1) * saePageSize;
            var filter = {
                status: 2,
                instance: $scope.instanceId
            };
            telemetryService.getAlertHistoryData(offset, saePageSize, filter, $scope.timeFilter).then(function (response) {
                $scope.alerts = response.alerts;
                $scope.alertColumns = response.alertColumns;
                $scope.alertsLoading = false;
            }, function () {
                $scope.alertsLoading = false;
            });
        };

        $scope.getRemediationData = function () {
            $scope.remediationData = [];
            $scope.remediationLoading = true;
            var offset = ($scope.remediationPage - 1) * saePageSize;
            var filter = {
                instance: $scope.instanceId
            };
            telemetryService.getRemediationData(offset, saePageSize, filter, $scope.timeFilter).then(function (response) {

                $scope.remediationData = response.remediationData;
                $scope.remediationColumns = response.remediationColumns;
                $scope.remediationLoading = false;

            }, function () {
                $scope.remediationLoading = false;
            });
        };

        $scope.getAlertPaginationRecord = function (page) {
            $scope.alertPage = page;
            $scope.getAlertHistory();
        };

        $scope.getRemediationPaginationRecord = function (page) {
            $scope.remediationPage = page;
            $scope.getRemediationData();
        };
        function init() {
            $scope.getAllInstances();
            if ($scope.instanceId) {
                $scope.getEventsData();
                $scope.getAlertHistory();
                $scope.getRemediationData();
            }
        }
        init();
    }

})();
