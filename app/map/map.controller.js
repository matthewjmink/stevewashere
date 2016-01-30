(function () {
    'use strict';

    angular.module('app.map')
        .controller('MapController', MapController);

    MapController.$inject = ['dataservice'];
    function MapController(dataservice) {
        var vm = this;

        vm.getLocations = getLocations;
        vm.updateLocation = updateLocation;
        vm.loading = true;
        vm.locations = null;
        vm.maxDays = 365;
        vm.now = Date.now();
        vm.success = null;
        vm.timeout = null;

        ////////////

        function getLocations() {
            return dataservice.getLocations();
        }

        function updateLocation(locationId) {
            return vm.locations.features.$save(vm.locations.features.$getRecord(locationId))
                .then(function(response){
                    return response;
                });
        }
    }
})();
