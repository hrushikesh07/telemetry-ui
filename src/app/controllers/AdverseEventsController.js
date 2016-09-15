(function () {

    angular
        .module('app')
        .controller('AdverseEventsController', [
            '$scope', 'telemetryService', 'toastr',
            AdverseEventsController
        ]);

    function AdverseEventsController($scope, telemetryService, toastr) {

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
        $scope.pageSize = 50;

        $scope.numberOfPages = function (allRecords)
        {
            return Math.ceil(allRecords.length / $scope.pageSize);
        };
        
        $scope.resetPage = function(){
            $scope.curPage = 0;
        };

        var urList = '/list_instances_running';
        telemetryService.promiseGet(urList).then(function (response) {
            $scope.instances = response.messageBody;
            $scope.dataloading = false;
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
            }

        });
    }

})();
