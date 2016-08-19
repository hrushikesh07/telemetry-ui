(function () {

    angular
        .module('app')
        .controller('MainController', [
            'navService', '$scope', 'telemetryService',
            MainController
        ]);

    function MainController(navService, $scope, telemetryService) {
        var vm = this;

        var urlToFetch = 'https://telemetry.rlcatalyst.com/catalyst_telemetry_events';

        var evtSource;
        if (typeof (EventSource) !== "undefined") {
            var eventSourceUrl = urlToFetch
            evtSource = new EventSource(eventSourceUrl)
        }
        evtSource.addEventListener('message', function (event) {

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
                    $scope.$broadcast('monitoringEvent', {message: parsedJson.messageBody});
                    break;
                case "alert":
                    $scope.$broadcast('alertEvent', {message: parsedJson.messageBody});
                    break;
                default:
                    //console.log(parsedJson.ping)
            }
        }, false);

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

        telemetryService.getAccount().then(function (response) {
            vm.accounts = response.data.messageBody;
            vm.selectedAccount = vm.accounts[0].accountName;
        }, function () {

        });


    }
})();
