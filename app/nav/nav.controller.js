(function(){
    'use strict';

    angular.module('app.nav')
        .controller('NavController', NavController);

    NavController.$inject = ['$state', '$timeout'];
    function NavController ($state, $timeout) {
        var vm = this;

        vm.isActive = isActive;
        vm.login = login;

        function isActive (stateName) {
            return $state.is(stateName);
        }

        function login () {
            var ref = new Firebase("https://stevewashere.firebaseio.com");
            ref.authWithOAuthPopup("google", function(error, authData) {
                if (error) {
                    console.log("Login Failed!", error);
                } else {
                    console.log("Authenticated successfully with payload:", authData);
                }
            });
        }
    }
})();
