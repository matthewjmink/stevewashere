(function () {
    'use strict';

    angular.module('app.map')
        .controller('ListController', ListController);

    ListController.$inject = ['dataservice'];
    function ListController(dataservice) {
        var vm = this;

        vm.locations = null;

        getLocations().then(function (locations) {
            vm.locations = locations.features;
            console.log(vm.locations);
        });

        ////////////

        function getLocations() {
            return dataservice.getLocations();
        }

    }
})();
