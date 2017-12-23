(function() {
    'use strict';

    angular
        .module('app', [
            /* angular modules */
            'ngCookies',
            /* third-party modules */
            'ui.router',
            /* app-services */
            'user.service'
        ])
        .run(run);

    run.$inject = ['$rootScope', '$state', '$log', '$cookies', '$transitions'];

    function run($rootScope, $state, $log, $cookies, $transitions) {
        $log.log("entered into the run");

        $transitions.onError({}, function(transition) {
            console.log('error', transition.error().message, transition);
        });

        $transitions.onStart({}, function(trans) {
            var acceptableRoutes = ['signup', 'login', 'token', 'requestPasswordReset', 'resetPassword'];
            var toState = trans.to().name;

            // so basically if they do not have a token and the route destination is not acceptable then go to login
            if (!$cookies.getObject('jwt-token') && acceptableRoutes.indexOf(toState) == -1) {
                $state.go('login');
            }
        });
    }

})();