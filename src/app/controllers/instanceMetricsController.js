(function () {

    angular
        .module('app')
        .controller('instanceMetricsController', [
            '$scope', 'telemetryService', 'instanceData', '$uibModalInstance',
            instanceMetricsController
        ]);

    function instanceMetricsController($scope, telemetryService, instanceData, $uibModalInstance) {

        $scope.instanceData = instanceData;

        $scope.dataloading = true;

        $scope.$on('updateMetrics', function () {
            $scope.instanceData.instanceMetrics = telemetryService.getInstanceMetrics(instanceData.instanceId);
        });

        $scope.close = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }

})();
