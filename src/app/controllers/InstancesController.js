(function () {

    angular
        .module('app')
        .controller('InstancesController', [
            '$scope', 'telemetryService', '$uibModal', 'toastr', '$stateParams',
            InstancesController
        ]);

    function InstancesController($scope, telemetryService, $uibModal, toastr, $stateParams) {

        var filters = {
            status: '',
            instance: ''
        };

        $scope.filter = angular.copy(filters);

        if ($stateParams.status) {
            $scope.filter.status = $stateParams.status;
        }

        $scope.resetFilter = function () {
            $scope.filter = angular.copy(filters);
            $scope.getInstances();
        };

        $scope.instances = [];

        $scope.instanceMetrics = {};

        $scope.dataloading = true;
        $scope.showInstanceMetrics = false;

        $scope.getInstances = function () {
            var url = '/instances';

            var filterCheck = false;

            if ($scope.filter.status && $scope.filter.status !== '') {
                url += '?status=' + $scope.filter.status;
                filterCheck = true;
            }

            if ($scope.filter.instance && $scope.filter.instance !== '') {
                if (filterCheck) {
                    url += '&';
                } else {
                    url += '?';
                }
                url += 'id=' + $scope.filter.instance;
            }

            telemetryService.promiseGet(url).then(function (response) {
                $scope.instances = response;
                $scope.dataloading = false;
            }, function () {
            });
        };




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
            var data = args.message, existing, filterCheck;
            for (var i = 0; i < data.length; i++) {
                existing = false, filterCheck = true;
                if ($scope.filter.status && $scope.filter.status !== '') {
                    if (data[i].status !== $scope.filter.status) {
                        filterCheck = false;
                    }
                }
                if ($scope.filter.instance && $scope.filter.instance !== '') {
                    if (data[i].id !== $scope.filter.instance) {
                        filterCheck = false;
                    }
                }
                if (filterCheck) {
                    for (var j = 0; j < $scope.instances.length; j++) {
                        if ($scope.filter.instance && $scope.filter.instance !== '') {
                            if (data.instanceId !== $scope.filter.instance) {
                                filterCheck = false;
                            }
                        }
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
            }
            $scope.$apply();
        });

        $scope.$on('monitoringEvent', function () {
            $scope.$broadcast('updateMetrics');
        });

        function init() {
            $scope.getInstances();
        }
        init();
    }

})();