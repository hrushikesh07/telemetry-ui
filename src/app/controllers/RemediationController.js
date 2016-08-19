(function () {

    angular
        .module('app')
        .controller('RemediationController', [
            '$scope', 'telemetryService', 'toastr',
            RemediationController
        ]);

    function RemediationController($scope, telemetryService,toastr) {
        
        $scope.remediationData = [];
        
        $scope.dataloading = true;

        telemetryService.getRemediationHistory().then(function (response) {
            $scope.remediationData = response.data.messageBody;
            $scope.dataloading = false;
        }, function () {

        });
//        $scope.$on('listInstancesEvent', function (event, args) {
//            var data = args.message, existing, msg = '';
//            for (var i = 0; i < data.length; i++) {
//                existing = false;
//                for (var j = 0; j < $scope.remediationData.length; j++) {
//                    if (data[i].instanceId === $scope.remediationData[j].instanceId) {
//
//                        $scope.remediationData[j] = data[i];
//                        msg = "Instance "+data[i].instanceName+"'s current state is "+data[i].state;
//                        showNotification(msg);
//                        existing = true;
//                        break;
//                    }
//                }
//
//
//                if (!existing) {
//                    $scope.remediationData.push(args.message[i]);
//                }
//            }
//            $scope.$apply();
//        });
        
        function showNotification(content){
           toastr.success(content);
        }
    }

})();
