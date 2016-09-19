(function () {

    angular
        .module('app')
        .controller('AdverseEventsController', [
            '$scope', 'telemetryService', 'toastr', 'pageSize', 'alertLimit',
            AdverseEventsController
        ]);

    function AdverseEventsController($scope, telemetryService, toastr, pageSize, alertLimit) {

        var filters = {
            status: '',
            instanceId: ''
        };

        $scope.filter = angular.copy(filters);

        $scope.resetFilter = function () {
            $scope.filter = angular.copy(filters);
        };

        $scope.instanceFilter = true;

        $scope.alerts = [];

        $scope.curPage = 0;
        $scope.pageSize = pageSize;

        $scope.numberOfPages = function (allRecords)
        {
            return Math.ceil(allRecords.length / $scope.pageSize);
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
            var timeStamp = new Date(alertData.timestamp * 1000);
            var timeStampIso = timeStamp.toISOString();
            var timeStampMinus = new Date((alertData.timestamp * 1000) - (5 * 60 * 1000));
            var timeStampMinusIso = timeStampMinus.toISOString();
            var elkLink = "http://elk.rlcatalyst.com/search/" + alertData.instanceId + "/" + timeStampMinusIso + "/" + timeStampIso;
            return encodeURI(elkLink);
        };
        $scope.dataloading = true;
        var url = '/alerthistory';
        telemetryService.promiseGet(url).then(function (response) {
            angular.forEach(response.messageBody, function (value, key) {
                if (value.status > 2) {
                    value.status = 3;
                }
                $scope.alerts.push(value);
            });

            $scope.dataloading = false;

        }, function () {

        });
        $scope.$on('alertEvent', function (event, args) {
            var data = args.message;
            console.log(data);
            if (data) {
                if (data.status > 2) {
                    data.status = 3;
                }
                $scope.alerts.push(data);
                if($scope.alerts.length>alertLimit){
                    $scope.alerts = $scope.alerts.slice(-alertLimit);
                }
                $scope.$apply();
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
    }

})();
