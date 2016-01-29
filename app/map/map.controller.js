(function () {
    'use strict';

    angular.module('app.map')
        .controller('MapController', MapController);

    MapController.$inject = ['dataservice'];
    function MapController(dataservice) {
        var vm = this;

        vm.getLocations = getLocations;
        vm.loading = true;
        vm.maxDays = 365;
        vm.now = Date.now();
        vm.success = null;
        vm.timeout = null;

        ////////////

        function getLocations() {
            return dataservice.getLocations();
        }
    }
})();
