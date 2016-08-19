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
        
        $scope.dataloading = true;
        
        telemetryService.getAlertHistory().then(function (response) {
            $scope.alerts = response.data.messageBody;
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
