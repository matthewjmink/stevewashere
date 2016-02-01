(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('colorService', colorService);

    /**
     * These functions are not my own work, though I cannot remember the source.
     *     I have simply converted them to a factory so I can calculate hex values
     *     from anywhere within the application.
     */
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
