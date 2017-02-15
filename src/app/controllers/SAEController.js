(function () {

    angular
        .module('app', ['nvd3', 'calHeatmap'])
        .controller('SAEController', [
            '$scope', '$stateParams', 'telemetryService', 'commonService', 'saePageSize', '$location', '$anchorScroll', SAEController
        ]);
    function SAEController($scope, $stateParams, telemetryService, commonService, saePageSize, $location, $anchorScroll) {

        $scope.currentView = 'sae';
        $scope.selectedInstance = {value: {}}
        $scope.heatmapEventsType = 2; //2: Critical, 1: Warning
        $scope.alerts = [];
        $scope.remediationData = [];
        $scope.alertColumns = {};
        $scope.aggregationColumns = {};
        $scope.remediationColumns = {};
        $scope.actionHistoryColumns = {};
        $scope.alertPage = 1;
        $scope.pageSize = saePageSize;
        $scope.calData = {};
        $scope.timeFilter = null;
        $scope.corelation = true;

        $scope.graphTitle = 'Events Data';
        $scope.graphType = 'Monthly Events';


        $scope.eventsLoading = true;
        $scope.alertsLoading = true;
        $scope.remediationLoading = true;
        $scope.actionHistoryLoading = true;
        $scope.showCorelationData = false;
        $scope.disablePre = false;
        $scope.disableNext = false;


        var currentDate = new Date();

        var startDate = commonService.addMonths(new Date(), -3);

        $scope.toDate = new Date(currentDate.getTime());

        $scope.fromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1);

        $scope.getAllInstances = function () {
            var urList = '/instances';
            telemetryService.promiseGet(urList).then(function (response) {
                $scope.instances = response;
                if ($stateParams.instanceId) {
                    for (var j = 0; j < $scope.instances.length; j++) {
                        if ($stateParams.instanceId === $scope.instances[j].id) {
                            $scope.selectedInstance.value = $scope.instances[j];
                            $scope.getEventsData();
                            $scope.getAlertHistory();
                            break;
                        }
                    }
                } else {
                    $scope.selectedInstance.value = $scope.instances[0];
                    $scope.getEventsData();
                    $scope.getAlertHistory();
                }
            }, function () {
            });
        };

        $scope.getInstanceData = function () {
            $scope.showCorelationData = false;
            $scope.getEventsData();
            $scope.getAlertHistory();
        };


        $scope.calClickEvent = function (date, nb) {
            $scope.timeFilter = commonService.getStartEndTime(date);
            $scope.showCorelationData = false;
            $scope.getAlertHistory();
        };

        $scope.changeHeatmapEventsType = function (type) {
            $scope.heatmapEventsType = type;
            $scope.alertPage = 1;
            $scope.showCorelationData = false;
            $scope.getEventsData();
            $scope.getAlertHistory();
        };

        $scope.showAll = function () {
            $scope.timeFilter = null;
            $scope.alertPage = 1;
            $scope.getAlertHistory();
        };



        $scope.calNavigation = function (nav) {
            if (nav === 'pre') {
                $scope.fromDate = new Date($scope.fromDate.getFullYear(), $scope.fromDate.getMonth() - 1, 1);
                $scope.toDate = new Date($scope.toDate.getFullYear(), $scope.toDate.getMonth(), 0);
            } else {
                $scope.fromDate = new Date($scope.fromDate.getFullYear(), $scope.fromDate.getMonth() + 1, 1);
                $scope.toDate = new Date($scope.toDate.getFullYear(), $scope.toDate.getMonth() + 2, 0);
            }
            $scope.getEventsData();
        };


        $scope.calConfig = {data: {}, start: startDate, domain: 'month', rowLimit: 4, range: 4, cellSize: 30, previousSelector: '#previousSelector-a-previous', nextSelector: '#previousSelector-a-next', onClick: $scope.calClickEvent};



        $scope.getEventsData = function () {
            $scope.eventsLoading = true;
            $scope.calConfig.data = {};

            if ($scope.toDate.getTime() >= currentDate.getTime()) {
                $scope.disableNext = true;
            } else {
                $scope.disableNext = false;
            }
            console.log('fromDate--->>>>' + $scope.fromDate);
            console.log('toDate--->>>>' + $scope.toDate);

            var fromTime = $scope.fromDate.toISOString();
            var toTime = $scope.toDate.toISOString();

            var url = '/analytics/alert/aggregate?checkStatus=' + $scope.heatmapEventsType + '&instance=' + $scope.selectedInstance.value.id + '&frequency=1_DAY&fromTime=' + fromTime + '&toTime=' + toTime;
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
                status: $scope.heatmapEventsType,
                instance: $scope.selectedInstance.value.id
            };
            telemetryService.getAlertHistoryData(offset, saePageSize, filter, $scope.timeFilter).then(function (response) {
                $scope.alerts = response.alerts;
                $scope.alertColumns = response.alertColumns;
                $scope.alertsLoading = false;
            }, function () {
                $scope.alertsLoading = false;
            });
        };

        $scope.getCorelationData = function (time) {
            $location.hash('corelationData');
            $anchorScroll();
            var timeStamp = new Date(time);
            $scope.remediationData = [];
            $scope.actionHistoryData = []
            $scope.showCorelationData = true;
            $scope.remediationLoading = true;
            $scope.actionHistoryLoading = true;
            var timeReference = timeStamp.getTime();
            telemetryService.getCorelationData($scope.selectedInstance.value.id, timeReference).then(function (response) {
                var remediation = response.remediation;
                $scope.actionHistoryData = response.actionHistory;
                $scope.remediationData = remediation.remediationData;
                $scope.remediationColumns = remediation.remediationColumns;
                $scope.remediationLoading = false;
                $scope.actionHistoryLoading = false;


            }, function () {
                $scope.showCorelationData = false;
                $scope.remediationLoading = false;
                $scope.actionHistoryLoading = false;
            });
        };

        $scope.getAlertPaginationRecord = function (page) {
            $scope.alertPage = page;
            $scope.getAlertHistory();
        };

        function init() {
            $scope.getAllInstances();
            if ($scope.selectedInstance.value.id) {
                $scope.getEventsData();
                $scope.getAlertHistory();
            }
        }
        init();
    }

})();
