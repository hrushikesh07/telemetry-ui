(function () {

    angular
        .module('app')
        .controller('addNewServicesController', ['$scope','telemetryService','$uibModalInstance','toastr','baseAPIUrl', function ($scope,telemetryService,$uibModalInstance,toastr,baseAPIUrl) {
            var aNs=this;
            aNs.newEnt={};
            $scope.close = function () {
                $uibModalInstance.dismiss('cancel');
            };

            aNs.save =function () {
                var req = {
                    method: 'POST',
                    url: baseAPIUrl+'/services',
                    data:aNs.newEnt,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                telemetryService.promiseOwn(req).then(function (response) {
                    toastr.success('Successfully created');
                    $uibModalInstance.dismiss(response);
                });
            };
        }]);
})();
