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
        telemetryService.promiseGet(url).then(function (response) {
            $scope.catsEyeData = response.messageBody;
            $scope.dataloading = false;
        }, function () {

        });
        
        //catch event source
        $scope.$on('catsEyeEvent', function (event, args) {
            var data = args.message;
            $scope.catsEyeData =data;
            $scope.$apply();
        });
    }

})();
