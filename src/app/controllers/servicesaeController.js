(function () {

    angular
        .module('app')
        .controller('servicesaeController', ['$scope', '$stateParams', 'telemetryService', 'commonService', 'saePageSize', '$location', '$anchorScroll','$uibModal', function ($scope, $stateParams, telemetryService, commonService, saePageSize, $location, $anchorScroll, $uibModal) {
                var serSae=this;
                serSae.filter= {
                };
                serSae.expendIn=null;
                $scope.subData=[];
                serSae.expIcon={};
                serSae.instDet={};
                $scope.instances=[];
                serSae.ini=function () {
                    serSae.getInstances();
                    telemetryService.promiseGet('/instances').then(function (response) {
                        serSae.subInstance = response;
                        angular.forEach(serSae.subInstance,function (val) {
                            serSae.instDet[val.id]= {ip:val.ipAddress, name:val.name};
                        });
                    }, function () {
                    });
                };
                serSae.getInstances = function () {
                    $scope.dataloading = true;
                    var url = '/services';

                    var filterCheck = false;

                    if (serSae.filter.status && serSae.filter.status !== '') {
                        url += '?status=' + serSae.filter.status;
                        filterCheck = true;
                    }

                    if (serSae.filter.name && serSae.filter.name !== '') {
                        if (filterCheck) {
                            url += '&';
                        } else {
                            url += '?';
                        }
                        url += 'name=' + serSae.filter.name;
                    }
                    if (serSae.filter.serviceMap && serSae.filter.serviceMap !== '') {
                        if (filterCheck) {
                            url += '&';
                        } else {
                            url += '?';
                        }
                        url += 'serviceMap=' + serSae.filter.serviceMap;
                    }
                    if (serSae.filter.id && serSae.filter.id !== '') {
                        if (filterCheck) {
                            url += '&';
                        } else {
                            url += '?';
                        }
                        url += 'id=' + serSae.filter.id;
                    }

                    telemetryService.promiseGet(url).then(function (response) {
                        $scope.instances = response;
                        $scope.dataloading = false;
                    }, function () {
                    });
                };
                serSae.expendRow =function (id) {
                    $scope.subData=[];
                    $scope.dataloadingSub = true;
                    serSae.expIcon={};
                    serSae.expendIn=id;
                    serSae.expIcon[id]=true;
                    telemetryService.promiseGet('/resources?serviceMap='+id).then(function (response) {
                        $scope.subData = response;
                        $scope.dataloadingSub = false;
                    }, function () {
                    });
                };
                serSae.collapseRow=function (id) {
                    serSae.expendIn=null;
                    serSae.expIcon[id]=false;
                };
                serSae.resetFilter=function () {
                    serSae.filter = {

                    };
                    serSae.getInstances();
                };
                serSae.addNewService =function () {
                    $uibModal.open({
                        animation: true,
                        templateUrl: 'app/views/addNewService.html',
                        controller: 'addNewServicesController as aNs',
                        backdrop: 'static',
                        keyboard: false,
                        size: 'md',
                        scope: $scope
                    }).result.then(function() {
                        serSae.getInstances();
                    }, function() {

                    });
                };
            $scope.$on('listServices', function (event, args) {
                var data = args.message;
                var checkNew=true;
                angular.forEach($scope.instances,function (val,key) {
                    if(val.name === data[0].name){
                        checkNew=false;
                    }
                    if(val.name === data[0].name && val.status !== data[0].status ){
                        $scope.instances[key].status=data[0].status;
                    }
                });
                if(checkNew){
                    $scope.instances.push(data[0]);
                    $scope.$apply();
                }
            });
            $scope.$on('listResources', function (event, args) {
                var data = args.message;
                console.log(data[0].id);
                angular.forEach($scope.subData,function (val,key) {
                    if(val.id === data[0].id && val.status !== data[0].status ){
                        $scope.subData[key].status=data[0].status;
                        $scope.$apply();
                    }
                });

            });
            serSae.ini();
        }]);
})();
