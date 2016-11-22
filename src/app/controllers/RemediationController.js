(function () {

    angular
        .module('app')
        .controller('RemediationController', [
            '$scope', 'telemetryService', 'pageSize', 'commonService',
                RemediationController
        ]);

    function RemediationController($scope, telemetryService, pageSize, commonService) {

        $scope.remediationData = [];        

        $scope.remediationPage = 1;

        $scope.remediationColumns = {};
        
        $scope.pageSize = pageSize;

        $scope.getRemediationData = function () {
            $scope.remediationData = [];
            $scope.remediationLoading = true;
            var offset = ($scope.remediationPage - 1) * pageSize;
            telemetryService.getRemediationData(offset, pageSize).then(function (response) {

                $scope.remediationData = response.remediationData;
                $scope.remediationColumns = response.remediationColumns;
                $scope.remediationLoading = false;

            }, function () {
                $scope.remediationLoading = false;
            });
        };
        
        $scope.getRemediationPaginationRecord = function(page){
            $scope.remediationPage = page;
            $scope.getRemediationData();
        };        

        function init() {
            $scope.getRemediationData();
        }
        ;
        init();
    }

})();
