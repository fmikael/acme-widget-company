(function () {
    'use strict';

    angular
        .module('user.service', [])
        .factory('userService', userService);

    userService.$inject = ['$http', '$log', '$cookies'];
    function userService($http, $log, $cookies) {
        var service = {};
    
        service.login = login;
        service.signup = signup;
        service.getUser = getUser;
        service.getUsers = getUsers;

        return service;    

        function login(username, password) {
            return $http.post('/login', { "username": username, "password": password })
                .then(function (response) {
                    if (response.data.token) {
                        $cookies.putObject('jwt-token', response.data.token);
                        $http.defaults.headers.common.Authorization = 'JWT ' + response.data.token;
                    }
                    return handleSuccess(response);
                }, handleError);
        }

        function signup(user) {
            return $http.post('/signup', { "user": user })
                .then(function (response) {
                    if (response.data.token) {
                        $cookies.putObject('jwt-token', response.data.token);
                        $http.defaults.headers.common.Authorization = 'JWT ' + response.data.token;
                    }
                    return handleSuccess(response);
                }, handleError);
        }        

        function getUser() {
            return $http.get('/getUser')
                .then(handleSuccess, handleError);
        }

        function getUsers() {
            return $http.get('/getUsers')
                .then(handleSuccess, handleError);
        }
        
        // private functions
        function handleSuccess(response) {
            $log.debug(response);
            return response;
        }

        function handleError(error) {
            $log.warn(error);
            return error;
        }
    }

})();