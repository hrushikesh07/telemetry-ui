(function () {

    angular
        .module('app')
        .controller('TelemetryController', [
            '$scope', 'telemetryService', '$uibModal', 'toastr',
            TelemetryController
        ]);

    function TelemetryController($scope, telemetryService, $uibModal, toastr) {

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

        $scope.instanceMetrics = {};

        $scope.dataloading = true;
        $scope.showInstanceMetrics = false;

        var url = '/list_instances';
        telemetryService.promiseGet(url).then(function (response) {
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

        $scope.showIntanceMetrics = function (instanceId, instanceName) {
            toastr.clear();
            $scope.showInstanceMetrics = !$scope.showInstanceMetrics;
            $scope.instanceMetrics = telemetryService.getInstanceMetrics(instanceId);
            if ($scope.instanceMetrics) {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'app/views/instanceMetrics.html',
                    controller: 'instanceMetricsController',
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    scope: $scope,
                    resolve: {
                        instanceData: function () {
                            return {
                                instanceId: instanceId,
                                instanceName: instanceName,
                                instanceMetrics: $scope.instanceMetrics
                            };
                        }
                    }
                });
            } else {
                toastr.warning('No metrics data available for this instance', '', {
                    closeButton: true
                });
            }

        };

        $scope.$on('listInstancesEvent', function (event, args) {
            var data = args.message, existing;
            for (var i = 0; i < data.length; i++) {
                existing = false;
                for (var j = 0; j < $scope.instances.length; j++) {
                    if (data[i].instanceId === $scope.instances[j].instanceId) {
                        angular.extend($scope.instances[j], data[i]);
                        existing = true;
                        break;
                    }
                }
                if (!existing) {
                    $scope.instances.push(data[i]);
                }
            }
            $scope.$apply();
        });

        $scope.$on('monitoringEvent', function () {
            $scope.$broadcast('updateMetrics');
        });
    }

})();