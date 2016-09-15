'use strict';

angular.module('catalystTelemetryApp', ['ngAnimate', 'ngCookies', 'ngTouch',
    'ngSanitize', 'ui.router', 'ui.bootstrap', 'toastr', 'app'])

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '',
                templateUrl: 'app/views/main.html',
                controller: 'MainController',
                controllerAs: 'main',
                abstract: true
            })
            .state('home.cateye', {
                url: '/cateye',
                templateUrl: 'app/views/cateye.html',
                controller: 'CatEyeController',
                controllerAs: 'vm',
                data: {
                    title: 'CatEye'
                }
            })
            .state('home.telemetry', {
                url: '/telemetry',
                templateUrl: 'app/views/telemetry.html',
                controller: 'TelemetryController',
                data: {
                    title: 'Telemetry'
                }
            })
            .state('home.adverse', {
                url: '/adverse',
                controller: 'AdverseEventsController',
                controllerAs: 'vm',
                templateUrl: 'app/views/adverseEvents.html',
                data: {
                    title: 'Adverse Events'
                }
            })
            .state('home.remediation', {
                url: '/remediation',
                controller: 'RemediationController',
                controllerAs: 'vm',
                templateUrl: 'app/views/remediation.html',
                data: {
                    title: 'Remediation'
                }
            })
            .state('home.sae', {
                url: '/sae/:instanceId',
                controller: 'SAEController',
                controllerAs: 'vm',
                templateUrl: 'app/views/sae.html',
                data: {
                    title: 'SAE Dashboard'
                }
            });

        $urlRouterProvider.otherwise('/cateye');

    })
    .constant('baseAPIUrl', 'http://telemetry-api.rlcatalyst.com');