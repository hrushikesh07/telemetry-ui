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
            $scope.dataloading = true;
            var offset = ($scope.remediationPage - 1) * pageSize;
            var url = '/remediation_history?orderBy=DESC&limit=' + pageSize + '&offset=' + offset;
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
