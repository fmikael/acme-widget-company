(function() {
    'use strict';

    angular.module('app')
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider', '$logProvider'];
    function config($stateProvider, $urlRouterProvider, $httpProvider, $logProvider) {

        $stateProvider
        // authenticated routes
        .state('home', {
            controller: 'homeController',
            controllerAs: 'vm',
            templateUrl: 'public/app/home/home.view.html',
            url: '/home'
        })
        .state('signup', {
            controller: 'loginController',
            controllerAs: 'vm',
            templateUrl: 'public/app/login/signup.view.html',
            url: '/signup'
        })

        // anonymous routes
        .state('login', {
            controller: 'loginController',
            controllerAs: 'vm',
            templateUrl: 'public/app/login/login.view.html',
            url: '/'
        });

        $urlRouterProvider.otherwise('/');
    }

})();
