(function () {

    angular
            .module('app')
            .controller('CatEyeController', [
                '$scope', 'telemetryService', 'commonService',
                CatEyeController
            ]);

    function CatEyeController($scope, telemetryService, commonService) {

        $scope.catsEyeData = {};

        $scope.dataloading = true;
        var url = '/catseye';
        telemetryService.promiseGet(url).then(function (response) {
            var data, catsEyeColumns = {}, catsEyeData = [];
            if (response.results[0].series) {
                data = response.results[0].series[0];
                catsEyeColumns = commonService.toObject(data.columns);
                catsEyeData = data.values[0];
            }
            $scope.catsEyeColumns = catsEyeColumns;
            $scope.catsEyeData = catsEyeData;
            $scope.dataloading = false;
        }, function () {

        });

        //catch event source
        $scope.$on('catsEyeEvent', function (event, args) {
            var data = args.message;
            $scope.catsEyeData = Object.values(data);
            $scope.$apply();
        });
    }

})();
