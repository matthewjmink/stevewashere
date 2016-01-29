(function () {
    angular
        .module('app.core')
        .factory('dataservice', dataservice);

    dataservice.$inject = ['$firebaseArray'];
    function dataservice($firebaseArray) {
        return {
            getLocations: getLocations
        };

        function getLocations() {
            var firebaseRef = new Firebase('https://stevewashere.firebaseio.com/locations');
            var locations = $firebaseArray(firebaseRef);
            return locations.$loaded()
                .then(getLocationsComplete)
                .catch(getLocationsFailed);

            function getLocationsComplete(locations) {
                return {
                    type: 'FeatureCollection',
                    metadata: {
                        title: 'Steve Mink Territory Clients',
                        status: 200,
                        api: '1.0.0',
                        count: locations.length
                    },
                    features: locations
                };
            }

            function getLocationsFailed(error) {
                console.log('getLocations failed: ' + error);
            }
        }
    }
})();
