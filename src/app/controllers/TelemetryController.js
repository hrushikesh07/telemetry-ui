(function () {

    angular
        .module('app')
        .controller('TelemetryController', [
            '$scope', 'telemetryService', '$uibModal', 'toastr',
            TelemetryController
        ]);

    function TelemetryController($scope, telemetryService, $uibModal, toastr) {

        var filters = {
            status: ''
        };

        $scope.filter = angular.copy(filters);

        $scope.resetFilter = function () {
            $scope.filter = angular.copy(filters);
        };

        $scope.instances = [];

        $scope.instanceMetrics = {};

        $scope.dataloading = true;
        $scope.showInstanceMetrics = false;

        var url = '/instances';
        telemetryService.promiseGet(url).then(function (response) {
            $scope.instances = response;
            $scope.dataloading = false;
        }, function () {
        });


        $scope.showIntanceMetrics = function (instance) {
            toastr.clear();
            $scope.showInstanceMetrics = !$scope.showInstanceMetrics;
            $scope.instanceMetrics = telemetryService.getInstanceMetrics(instance.id);
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
                                instance: instance,
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
                    if (data[i].id === $scope.instances[j].id) {
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