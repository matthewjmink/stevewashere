(function() {
    'use strict';

    angular
        .module('app.list')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'list',
                config: {
                    url: '/list',
                    templateUrl: '/list/list.html',
                    controller: 'ListController',
                    controllerAs: 'list'
                }
            }
        ];
    }
})();
