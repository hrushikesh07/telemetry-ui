(function () {

    angular
        .module('app')
        .controller('CatEyeController', [
            '$scope', 'telemetryService',
            CatEyeController
        ]);

    function CatEyeController($scope, telemetryService) {
        
        $scope.catsEyeData = {};
        
        $scope.dataloading = true;
        
        telemetryService.getCatsEye().then(function (response) {
            $scope.catsEyeData = response.data.messageBody;
            $scope.dataloading = false;
        }, function () {

        });
    }

})();
