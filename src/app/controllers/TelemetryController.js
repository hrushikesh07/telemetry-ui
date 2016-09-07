(function () {

    angular
        .module('app')
        .controller('TelemetryController', [
            '$scope', 'telemetryService', 'toastr', '$uibModal',
            TelemetryController
        ]);

    function TelemetryController($scope, telemetryService, toastr, $uibModal) {

        var filters = {
            state: '',
            monitoring: '',
            remediation: ''
        };

        $scope.filter = angular.copy(filters);

        $scope.resetFilter = function () {
            $scope.filter = angular.copy(filters);
        };

        $scope.instances = [];

        $scope.dataloading = true;

        var url = '/list_instances_running';
        telemetryService. promiseGet(url).then(function (response) {
            $scope.instances = response.messageBody;
            $scope.dataloading = false;
        }, function () {
        });


        $scope.showIntanceAdverse = function (instanceId, instanceName) {
            $uibModal.open({
                animation: true,
                templateUrl: 'app/views/instanceAdverse.html',
                controller: 'instanceAdverseController',
                backdrop: 'static',
                size: 'lg',
                keyboard: false,
                resolve: {
                    instanceData: function () {
                        return {
                            instanceId: instanceId,
                            instanceName: instanceName
                        };
                    }
                }
            });
        };
        
        $scope.$on('listInstancesEvent', function (event, args) {
            var data = args.message, existing, msg = '';
            for (var i = 0; i < data.length; i++) {
                existing = false;
                for (var j = 0; j < $scope.instances.length; j++) {
                    if (data[i].instanceId === $scope.instances[j].instanceId) {
                        angular.extend($scope.instances[j], data[i]);
                        msg = "Instance " + data[i].instanceName + "'s current state is " + data[i].state;
                        showNotification(msg);
                        existing = true;
                        break;
                    }
                }


                if (!existing) {
                    $scope.instances.push(args.message[i]);
                }
            }
            $scope.$apply();
        });

        function showNotification(content) {
            //toastr.success(content);
        }
    }

})();
