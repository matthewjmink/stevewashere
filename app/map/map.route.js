(function() {
    'use strict';

    angular
        .module('app.map')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'map',
                config: {
                    url: '/',
                    templateUrl: '/map/map.html',
                    controller: 'MapController',
                    controllerAs: 'map',
                    classList: 'overlay-panel',
                    public: true
                }
            }
        ];
    }
})();
