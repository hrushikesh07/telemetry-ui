(function () {

    angular
        .module('app')
        .controller('instanceAdverseController', [
            '$scope', 'telemetryService', 'instanceData', '$uibModalInstance',
            instanceAdverseController
        ]);

    function instanceAdverseController($scope, telemetryService, instanceData, $uibModalInstance) {

        var filters = {
            status: '',
            instanceId: ''
        };

        $scope.filter = angular.copy(filters);

        $scope.resetFilter = function () {
            $scope.filter = angular.copy(filters);
        };
        
        $scope.instanceFilter = false;
        
        $scope.alerts = [];
        
        $scope.instanceData = instanceData;
        
        $scope.dataloading = true;
        
        $scope.curPage = 0;
        $scope.pageSize = 50;

        $scope.numberOfPages = function (allRecords)
        {
            return Math.ceil(allRecords.length / $scope.pageSize);
        };
        
        $scope.resetPage = function(){
            $scope.curPage = 0;
        };

        var url = '/alerthistory';
        telemetryService. promiseGet(url).then(function (response) {
            var allAlerts = response.messageBody;
            for (var j = 0; j < allAlerts.length; j++) {
                if ($scope.instanceData.instanceId === allAlerts[j].instanceId) {
                    $scope.alerts.push(allAlerts[j]);
                }
            }
            $scope.dataloading = false;
        }, function () {

        });
        
        $scope.close =  function(){
            $uibModalInstance.dismiss('cancel');
        };
        
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
