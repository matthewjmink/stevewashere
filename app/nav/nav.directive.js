(function () {
    'use strict';

    angular
        .module('app.nav')
        .directive('menuToggle', navToggle)
        .directive('nav', navElement);

    navToggle.$inject = ['$document', '$rootScope'];
    function navToggle($document, $rootScope) {
        return {
            restrict: 'A',
            link: link
        };

        function link (scope, element) {
            $rootScope.$on('$stateChangeSuccess', function(){
                $document[0].body.classList.remove('menu-active');
            });
            element.on('click', function(e){
                $document[0].body.classList.toggle('menu-active');
            });
        }
    }

    function navElement() {
        return {
            restrict: 'AE',
            controller: 'NavController',
            controllerAs: 'nav',
            templateUrl: '/nav/nav.html'
        };
    }

}());
