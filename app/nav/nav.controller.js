(function(){
    'use strict';

    angular.module('app.nav')
        .controller('NavController', NavController);

    NavController.$inject = ['$state', '$timeout'];
    function NavController ($state, $timeout) {
        var vm = this;

        vm.isActive = isActive;

        function isActive (stateName) {
            return $state.is(stateName);
        }
    }
})();
