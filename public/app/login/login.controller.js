(function() {
    'use strict';

    angular
        .module('app')
        .controller('loginController', loginController);

    loginController.$inject = ['$log', '$scope', '$http', '$state', 'userService'];

    function loginController($log, $scope, $http, $state, userService) {
        var vm = this;
        // variables
        vm.user = {};
        // functions
        vm.login = login;
        vm.signup = signup;

        (function initController() {
            $log.log("initializing - loginController");
        })();        

        function login() {
            userService.login(vm.user.username, vm.user.password)
                .then(function(response) {
                    if (response.status === 200) {
                        $log.debug("success - login");                         
                         $state.go('home');
                    } else {
                        $log.error("failure - login");
                        swal("Error", response.data.message, "error");
                    }
                });
        };

        function signup() {
            if (vm.user.password != vm.user.confirmPassword) {
                swal("Error", "Your passwords do not match", "error");
                return true;
            }
            userService.signup(vm.user)
                .then(function(response) {
                    if (response.status === 200) {
                        $log.debug("success - login");                         
                         $state.go('home');
                    } else {
                        $log.error("failure - login");
                        swal("Error", response.data.message, "error");
                    }
                });
        };
    }
})();
