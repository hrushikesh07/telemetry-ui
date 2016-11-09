(function () {

    angular
        .module('app', ['nvd3'])
        .controller('SAEController', [
            '$scope', '$stateParams', 'telemetryService', 'commonService', 'pageSize', SAEController
        ]);
    function SAEController($scope, $stateParams, telemetryService, commonService, pageSize) {

        $scope.instanceId = $stateParams.instanceId;
        $scope.alerts = [];
        $scope.remediationData = [];
        $scope.alertColumns = {};
        $scope.remediationColumns = {};
        $scope.alertPage = 1;
        $scope.remediationPage = 1;
        $scope.pageSize = pageSize;
        var eventsData = [
            {
                key: "Cumulative Return",
                values: []
            }
        ];
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var fromTime = firstDay.toISOString();
        var toTime = date.toISOString();
        var url = '/analytics/alert/aggregate?status=2&instance=' + $scope.instanceId + '&frequency=1_HOUR&fromTime=' + fromTime + '&toTime=' + toTime;
        telemetryService.promiseGet(url).then(function (response) {

            var data;
            if (response.results[0].series) {
                data = response.results[0].series[0];
                $scope.alertColumns = commonService.toObject(data.columns);
                data.values = data.values.slice(0, 20);
                eventsData[0].values = data.values;
                $scope.data = eventsData;
                $scope.dataloading = false;
            } else {
                $scope.dataloading = false;
            }

        }, function () {

        });
        $scope.getAlertHistory = function () {
            $scope.alerts = [];
            var offset = ($scope.alertPage - 1) * pageSize;
            var url = '/alerthistory?instance=' + $scope.instanceId+'&orderBy=DESC&limit=' + pageSize + '&offset=' + offset;
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

        $scope.getRemediationData = function () {
            $scope.remediationData = [];
            var offset = ($scope.remediationPage - 1) * pageSize;
            var url = '/remediation_history?instance=' + $scope.instanceId+'&orderBy=DESC&limit=' + pageSize + '&offset=' + offset;
            telemetryService.promiseGet(url).then(function (response) {

                var data;
                if (response.results[0].series) {
                    data = response.results[0].series[0];
                    $scope.remediationColumns = commonService.toObject(data.columns);
                    $scope.remediationData = data.values;

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
        
        $scope.getRemediationPaginationRecord = function(page){
            $scope.remediationPage = page;
            $scope.getRemediationData();
        };

        $scope.options = {
            chart: {
                type: 'discreteBarChart',
                height: 300,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 50,
                    left: 55
                },
                x: function (d) {
                    var date = new Date(d[$scope.alertColumns.time]);
//                    return d3.time.format("%d %b")(date);
                    return d3.time.format("%H:%M")(date);
                },
                y: function (d) {
                    return d[$scope.alertColumns.value];
                },
                showValues: true,
                duration: 500,
                xAxis: {
                    axisLabel: 'Date'
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    axisLabelDistance: -10
                }
            }
        };
        console.log();
        $scope.changeGraph = function (type) {
            if (type === 'events') {
                $scope.data = eventsData;
                $scope.graphTitle = 'Events Data';
                $scope.options.chart.yAxis.axisLabel = 'Events';
            }
        };
        function init() {
            $scope.changeGraph('events');
            $scope.getAlertHistory();
            $scope.getRemediationData();
        }
        init();
    }

})();
