(function () {
    'use strict';

    angular.module('app')
        .service('commonService', [
            commonService
        ]);

    function commonService() {
        var serviceInterface = {
            toObject: function (arr) {
                var rv = {}, key;
                for (var i = 0; i < arr.length; ++i) {
                    key = arr[i];
                    rv[key] = i;
                }
                return rv;
            }
        };
        return serviceInterface;
    }

})();
