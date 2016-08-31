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
            instanceId: '',
        };

        $scope.filter = angular.copy(filters);

        $scope.resetFilter = function () {
            $scope.filter = angular.copy(filters);
        };
        
        $scope.instanceFilter = true;
        
        $scope.alerts = [];

        var urList = '/list_instances';
        telemetryService. promiseGet(urList).then(function (response) {
            $scope.instances = response.messageBody;
            $scope.dataloading = false;
        }, function () {
        });
        $scope.getElkLink = function(alertData) {
            var timeStamp = new Date(alertData.timestamp * 1000);
            var timeStampIso = timeStamp.toISOString();
            var timeStampMinus = new Date((alertData.timestamp * 1000) - (5 * 60 * 1000));
            var timeStampMinusIso = timeStampMinus.toISOString();
            var elkLink = "http://elk.rlcatalyst.com/search/" + alertData.instanceId + "/" + timeStampMinusIso + "/" + timeStampIso;
            return encodeURI(elkLink);
        };
        $scope.dataloading = true;
        var url = '/alerthistory';
        telemetryService. promiseGet(url).then(function (response) {
            $scope.alerts = response.messageBody;
            $scope.dataloading = false;

        }, function () {

        });
        $scope.$on('alertEvent', function (event, args) {
            var data = args.message, existing = false, msg = '';
            console.log(data);
//            for (var i = 0; i < data.length; i++) {
//                $scope.alerts.push(args.message[i]);
//            }
//            $scope.$apply();
        });
    }

})();
