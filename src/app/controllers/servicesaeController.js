(function () {

    angular
        .module('app')
        .controller('servicesaeController', ['$scope', '$stateParams', 'telemetryService', 'commonService', 'saePageSize', '$location', '$anchorScroll','$uibModal', function ($scope, $stateParams, telemetryService, commonService, saePageSize, $location, $anchorScroll, $uibModal) {
                var serSae=this;
                serSae.filter= {
                };
                serSae.expendIn=null;
                serSae.subData=[];
                serSae.expIcon={};
                serSae.ini=function () {
                    serSae.getInstances();
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
                        serSae.instances = response;
                        $scope.dataloading = false;
                    }, function () {
                    });
                };
                serSae.expendRow =function (id) {
                    serSae.expIcon={};
                    serSae.expendIn=id;
                    serSae.expIcon[id]=true;
                    //telemetryService.promiseGet('/services/'+id+'/resources').then(function (response) {
                    //     serSae.instances = response;
                    //     $scope.dataloading = false;
                    // }, function () {
                    // });
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
            serSae.ini();
        }]);
})();
