(function () {

    angular
            .module('app')
            .controller('MainController', [
                'navService', '$scope','$rootScope', 'telemetryService', 'toastr', 'baseAPIUrl',
                MainController
            ])
            .filter('pagination', function ()
            {
                return function (input, start)
                {
                    start = +start;
                    return input.slice(start);
                };
            });

    function MainController(navService, $scope, $rootScope,telemetryService, toastr, baseAPIUrl) {
        var vm = this;
        $rootScope.year=new Date().getFullYear();
        var urlToFetch = baseAPIUrl + '/catalyst_telemetry_events';

        var evtSource;
        if (typeof (EventSource) !== "undefined") {
            var eventSourceUrl = urlToFetch
            evtSource = new EventSource(eventSourceUrl)
        }
        var handleCallback = function (event) {
            var parsedJson = JSON.parse(event.data);
            switch (parsedJson.messageType) {
                case "catsEyeAccountsCount":
                    break;
                case "catsEye":
                    $scope.$broadcast('catsEyeEvent', {message: parsedJson.messageBody});
                    break;
                case "listInstances":
                    $scope.$broadcast('listInstancesEvent', {message: parsedJson.messageBody});
                    break;
                case "services":
                    $scope.$broadcast('listServices', {message: parsedJson.messageBody});
                    break;
                case "resources":
                    $scope.$broadcast('listResources', {message: parsedJson.messageBody});
                    break;
                case "monitoring":
                    telemetryService.updateInstanceMetrics(parsedJson.messageBody);
                    $scope.$broadcast('monitoringEvent');
                    break;
                case "alert":
                    if (parsedJson.messageBody.checkStatus && parsedJson.messageBody.checkStatus === '2' && parsedJson.messageBody.significance === 'true') {
                        toastr.error(parsedJson.messageBody.checkOutput, 'Critical', {
                            closeButton: true
                        });
                    }
                    $scope.$broadcast('alertEvent', {message: parsedJson.messageBody});
                    break;
                default:
                //console.log(parsedJson.ping)
            }
        }
        evtSource.addEventListener('message', handleCallback, false);

        evtSource.addEventListener('open', function (event) {
            console.log('eventsource connected.')
        }, false);

        evtSource.addEventListener('error', function (event) {
            if (event.eventPhase == EventSource.CLOSED) {
                console.log('eventsource was closed.')
            }
        }, false);

        navService
                .loadAllItems()
                .then(function (menuItems) {
                    vm.menuItems = [].concat(menuItems);
                });
        var url = '/accounts';
        telemetryService.promiseGet(url).then(function (response) {
            vm.accounts = response.messageBody;
//            vm.selectedAccount = vm.accounts[0].accountName;
            vm.selectedAccount = '';
        }, function () {

        });
    }
})();
