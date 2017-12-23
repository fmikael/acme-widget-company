(function() {
    'use strict';

    angular
        .module('app')
        .controller('homeController', homeController);

    homeController.$inject = ['$log', '$scope', '$cookies', '$state', 'userService'];
    function homeController($log, $scope, $cookies, $state, userService) {
        var vm = this;
        // variables
        vm.friends = [];
        vm.users = {};
        // functions
        vm.getUser = getUser;
        vm.getUsers = getUsers;

        (function initController() {
            $log.log("initializing - home controller");
            vm.getUser();
            vm.getUsers();
        })();

        function getUser() {
            userService.getUser()
                .then(function(response) {
                    if (response.status === 200) {
                        $log.debug("success - getUser");
                        vm.user = response.data.user;
                    } else {
                        $log.error("failure - getUser");
                        swal("Error", response.data.message, "error");
                    }
                });
        };

        function getUsers() {
            userService.getUsers()
                .then(function(response) {
                    if (response.status === 200) {
                        $log.debug("success - getUsers");
                        vm.users = response.data.users;
                    } else {
                        $log.error("failure - getUsers");
                        swal("Error", response.data.message, "error");
                    }
                });
        };
        
    }
})();