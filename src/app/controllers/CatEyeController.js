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
        var url = '/catseye';
        telemetryService. promiseGet(url).then(function (response) {
            $scope.catsEyeData = response.messageBody;
            $scope.dataloading = false;
        }, function () {

        });
    }

})();
