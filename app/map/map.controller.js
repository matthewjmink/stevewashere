(function () {
    'use strict';

    angular.module('app.map')
        .controller('MapController', MapController);

    MapController.$inject = ['$http'];
    function MapController($http) {
        var vm = this;

        vm.getLocations = getLocations;
        vm.loading = true;
        vm.maxDays = 365;
        vm.now = Date.now();
        vm.success = null;
        vm.timeout = null;

        ////////////

        function getLocations () {
            var get = $http.get('./data.json?d='+vm.now);
            return{
                then: function(callback){
                    get.success(function(data){
                        callback(data);
                    });
                }
            };
        }
    }
})();
