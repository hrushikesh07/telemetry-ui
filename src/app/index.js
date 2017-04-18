'use strict';

angular.module('catalystTelemetryApp', ['ngAnimate', 'ngCookies', 'ngTouch',
    'ngSanitize', 'ui.router', 'ui.bootstrap', 'toastr', 'commonFilters','ui.select', 'app'])

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
            .state('home.instances', {
                url: '/instances?status',
                templateUrl: 'app/views/instances.html',
                controller: 'InstancesController',
                data: {
                    title: 'Instances'
                }
            })
            .state('home.events', {
                url: '/events?instanceId&checkStatus',
                controller: 'EventsController',
                controllerAs: 'vm',
                templateUrl: 'app/views/events.html',
                data: {
                    title: 'Events'
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
            }).state('home.serviceSae', {
            url: '/serviceSae',
            controller: 'servicesaeController',
            controllerAs: 'serSae',
            templateUrl: 'app/views/serviceSae.html',
            data: {
                title: 'Service Sae Dashboard'
            }
        });

        $urlRouterProvider.otherwise('/cateye');

    })
    .constant('baseAPIUrl', 'https://telemetry-api.rlcatalyst.com')
//.constant('baseAPIUrl', 'http://192.168.152.154:8080')
    .constant('pageSize', 10)
    .constant('saePageSize', 5);