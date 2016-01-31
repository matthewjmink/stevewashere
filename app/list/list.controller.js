(function () {
    'use strict';

    angular.module('app.map')
        .controller('ListController', ListController);

    ListController.$inject = ['dataservice', 'colorService'];
    function ListController(dataservice, colorService) {
        var vm = this;

        vm.locations = null;
        vm.now = Date.now();
        vm.maxDays = 365;
        vm.getColor = getColor;

        vm.sortOptions = [
            {
                label: 'Client Name',
                value: 'properties.name'
            },
            {
                label: 'Last Check-in (recent first)',
                value: '-properties.last_checkin'
            },
            {
                label: 'Last Check-in (oldest first)',
                value: 'properties.last_checkin'
            }
        ];
        vm.sort = vm.sortOptions[0];

        getLocations().then(function (locations) {
            vm.locations = locations.features;
            console.log(vm.locations);
        });

        ////////////

        function getLocations() {
            return dataservice.getLocations();
        }

        function getColor (lastCheckin) {
            var diff = (vm.now - lastCheckin) / (1000 * 60 * 60 * 24);
            if (diff < vm.maxDays) {
                var h = 120 - ( (diff / vm.maxDays) * 120);
                var hex = colorService.hsvToHex(h, 100, 100);
                return {'border-left-color': '#'+hex};
            } else {
                return {'border-left-color': '#FF0000'};
            }
        }

    }
})();
