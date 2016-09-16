(function () {

    angular
        .module('app')
        .controller('MainController', [
            'navService', '$scope', 'telemetryService', 'toastr', 'baseAPIUrl',
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

    function MainController(navService, $scope, telemetryService, toastr, baseAPIUrl) {
        var vm = this;

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
                case "monitoring":
                    telemetryService.updateInstanceMetrics(parsedJson.messageBody);
                    $scope.$broadcast('monitoringEvent');
                    break;
                case "alert":
                    if (parsedJson.messageBody.status && parsedJson.messageBody.status === 2) {
                        if (parsedJson.messageBody.status === 1) {
                            toastr.warning(parsedJson.messageBody.reason, 'Warning', {
                                closeButton: true
                            });
                        } else if (parsedJson.messageBody.status === 2) {
                            toastr.error(parsedJson.messageBody.reason, 'Critical', {
                                closeButton: true
                            });
                        } else {
                            toastr.error(parsedJson.messageBody.reason, 'Error', {
                                closeButton: true
                            });
                        }

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
