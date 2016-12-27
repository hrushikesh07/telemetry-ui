(function () {
    'use strict';

    angular.module('app')
            .service('commonService', [
                commonService
            ]);

    function commonService() {
        this.toObject = function (arr) {
            var rv = {}, key;
            for (var i = 0; i < arr.length; ++i) {
                key = arr[i];
                rv[key] = i;
            }
            return rv;
        };
        this.getElkLink = function (time, instanceid) {
            var timeStamp = new Date(time);
            var timeStampIso = timeStamp.toISOString();
            var timeStampMinus = new Date(timeStamp.getTime() - (5 * 60 * 1000));
            var timeStampMinusIso = timeStampMinus.toISOString();
            var elkLink = "http://elk.rlcatalyst.com/search/" + instanceid + "/" + timeStampMinusIso + "/" + timeStampIso;
            return encodeURI(elkLink);
        };
        this.addMonths = function (date, months) {
            date.setMonth(date.getMonth() + months);
            return date;
        };
        this.getStartEndTime = function (date) {
            var start = new Date(date);
            start.setHours(0, 0, 0, 0);

            var end = new Date(date);
            end.setHours(23, 59, 59, 999);
            var res = {
                startTime: start,
                endTime: end
            };
            return res;
        };
        this.pad = function (number) {
            if (number < 10) {
                return '0' + number;
            }
            return number;
        };
        this.toISOStringFormat = function (date) {
            return date.getFullYear() +
                    '-' + this.pad(date.getMonth() + 1) +
                    '-' + this.pad(date.getDate()) +
                    'T' + this.pad(date.getHours()) +
                    ':' + this.pad(date.getMinutes()) +
                    ':' + this.pad(date.getSeconds()) +
                    '.' + (date.getMilliseconds() / 1000).toFixed(3).slice(2, 5) +
                    'Z';
        };
    }
})();
