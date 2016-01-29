(function() {
  'use strict';

  angular.module('steveWasHere', ['ngAnimate'])
    .controller('MapController', MapController)
    .directive('map', map);



  /**
   * Google Map Directive
   */
  map.$inject = ['$compile', '$http', '$timeout'];
  function map ($compile, $http, $timeout) {
    return {
      restrict: 'EA',
      link: linkFunc,
    };

    ////////////

    function linkFunc(scope, element, attrs) {

      scope.vm.anchor = new google.maps.MVCObject();
      scope.vm.checkIn = checkIn;
      scope.vm.currentLocation = {latitude: 42.5673029, longitude: -87.9162311};
      scope.vm.getMarkerIcon = getMarkerIcon;
      scope.vm.infoContent = $compile(
        '<div class="checkin-container">'+
          '<h5>{{vm.location.getProperty("name")}}</h5>'+
          '<p><small>Last visit: {{ vm.location.getProperty("last_checkin") | date : \'short\'}}</small></p>'+
          '<button class="btn btn-primary btn-lg" ng-click="vm.checkIn();">Steve Was Here</button>'+
        '</div>')(scope);
      scope.vm.infoWindow = new google.maps.InfoWindow(
          {
            content: scope.vm.infoContent[0],
            pixelOffset: new google.maps.Size(0, -32)
          }
        );
      scope.vm.map = null;

      google.maps.event.addDomListener(window, 'load', getCurrentLocation);

      //////////

      function addMapData (data) {
        scope.vm.locations = data;
        scope.vm.map.data.addGeoJson(scope.vm.locations);
        setMarkerStyle();
        registerClickEvents();

        var nearbyLocations = findNearby();
        if(nearbyLocations.length > 0){
          if(nearbyLocations.length > 1){
            nearbyLocations.sort(sortByDistance);
          }
          openInfoWindow(nearbyLocations[0]);
        }

        scope.vm.loading = false;
      }

      function checkIn () {
        scope.vm.now = Date.now();
        // scope.vm.location.G.last_checkin = scope.vm.now;
        scope.vm.location.setProperty('last_checkin', scope.vm.now);
        setMarkerStyle();
        $http.post('./dataservice.php', scope.vm.locations)
          .success(function(data){
            scope.vm.success = true;
            scope.vm.timeout = $timeout(function() {
              scope.vm.success = false;
            }, 2500);
            scope.vm.infoWindow.close();
          });
      }

      function findNearby () {
        var locations = scope.vm.locations.features;
        var nearbyLocations = [];

        for(var i = 0; i < locations.length; i++){
          var d = getDistance(
            scope.vm.currentLocation.latitude,
            scope.vm.currentLocation.longitude,
            locations[i].geometry.coordinates[1],
            locations[i].geometry.coordinates[0]);
          if(d < 5){
            var feature = scope.vm.map.data.getFeatureById(scope.vm.locations.features[i].id);
            feature.setProperty('nearbyDistance', d);
            nearbyLocations.push(feature);
          }
        }
        return nearbyLocations;
      }

      function getCurrentLocation () {
        var options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(success, error, options);

        function success (pos) {
          scope.vm.currentLocation = pos.coords;
          initialize();
        }

        function error (err) {
          initialize();
        }

      }

      function getDistance (lat1, lng1, lat2, lng2) {
        var R = 6371;
        var a =
        0.5 - Math.cos((lat2 - lat1) * Math.PI / 180)/2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        (1 - Math.cos((lng2 - lng1) * Math.PI / 180))/2;

        return R * 2 * Math.asin(Math.sqrt(a));
      }

      function getMarkerIcon (lastCheckin) {
        var diff = (scope.vm.now - lastCheckin) / (1000 * 60 * 60 * 24);
        if (diff < scope.vm.maxDays) {
          var h = 120 - ( (diff / scope.vm.maxDays) * 120);
          var hex = colorService().hsvToHex(h, 100, 100);
          return 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=|'+hex;
        } else {
          return 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=|FF0000';
        }
      }

      function initialize () {
        var mapOptions = {
          // center: {lat: 42.5673029, lng: -87.9162311},
          center: { lat: scope.vm.currentLocation.latitude, lng: scope.vm.currentLocation.longitude },
          zoom: 13
        };
        scope.vm.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        scope.vm.getLocations().then(addMapData);
      }

      function openInfoWindow (feature) {
        scope.vm.location = feature;
        // scope.$apply();
        // console.log(scope.vm.location);
        scope.vm.anchor.set('position',feature.j.j);
        scope.vm.infoWindow.open(scope.vm.map,scope.vm.anchor);
      }

      function registerClickEvents (argument) {
        scope.vm.map.data.addListener('click', function(event) {
          scope.vm.location = event.feature;
          // console.log(scope.vm.location);

          scope.$apply();
          var anchor = new google.maps.MVCObject();
          anchor.set('position',event.latLng);
          scope.vm.infoWindow.open(scope.vm.map,anchor);
        });
      }

      function setMarkerStyle () {
        scope.vm.map.data.setStyle(function(feature) {
          var lastCheckin = feature.getProperty('last_checkin');
          var icon = scope.vm.getMarkerIcon(lastCheckin);
          return {
            icon: icon
          };
        });
      }

      function sortByDistance(a,b) {
        if (a.getProperty('nearbyDistance') < b.getProperty('nearbyDistance'))
          return -1;
        if (a.getProperty('nearbyDistance') > b.getProperty('nearbyDistance'))
          return 1;
        return 0;
      }

    }
  }

  function colorService(){
    var trimLeft = /^[\s,#]+/,
      trimRight = /\s+$/,
      math = Math,
      mathRound = math.round,
      mathMin = math.min,
      mathMax = math.max,
      mathRandom = math.random;

    return {
      hsvToHex: hsvToHex,
      hsvToRgb: hsvToRgb,
      rgbToHex: rgbToHex
    };

    function hsvToHex(h, s, v) {
      var rgb = hsvToRgb(h, s, v);
      return rgbToHex(rgb.r, rgb.g, rgb.b);
    }

    function hsvToRgb(h, s, v) {
      h = bound01(h, 360) * 6;
      s = bound01(s, 100);
      v = bound01(v, 100);

      var i = math.floor(h),
      f = h - i,
      p = v * (1 - s),
      q = v * (1 - f * s),
      t = v * (1 - (1 - f) * s),
      mod = i % 6,
      r = [v, q, p, p, t, v][mod],
      g = [t, v, v, q, p, p][mod],
      b = [p, p, t, v, v, q][mod];

      return { r: r * 255, g: g * 255, b: b * 255 };
    }

    function rgbToHex(r, g, b) {
      var hex = [
      pad2(mathRound(r).toString(16)),
      pad2(mathRound(g).toString(16)),
      pad2(mathRound(b).toString(16))
      ];
      return hex.join('');
    }

    function bound01(n, max) {
      if (isOnePointZero(n)) { n = '100%'; }
      var processPercent = isPercentage(n);
      n = mathMin(max, mathMax(0, parseFloat(n)));
      if (processPercent) {
        n = parseInt(n * max, 10) / 100;
      }
      if ((math.abs(n - max) < 0.000001)) {
        return 1;
      }
      return (n % max) / parseFloat(max);
    }

    function isOnePointZero(n) {
      return typeof n === 'string' && n.indexOf('.') !== -1 && parseFloat(n) === 1;
    }

    function isPercentage(n) {
      return typeof n === 'string' && n.indexOf('%') !== -1;
    }

    function pad2(c) {
      return c.length === 1 ? '0' + c : '' + c;
    }
  }

})();
