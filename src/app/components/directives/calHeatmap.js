'use strict';

angular.module('calHeatmap', [])
    .directive('calHeatmap', function () {
        function link(scope, el,attrs) {
            var config = scope.config;
            var elemenent = el[0];
            var cal = new CalHeatMap();
            cal.init({
                itemSelector: elemenent,
                domain: !config ? 'month' : config.domain ? config.domain : 'month',
                subDomain: !config ? 'day' : config.subDomain ? config.subDomain : 'day',
                subDomainTextFormat: !config ? '%d' : config.subDomainTextFormat ? config.subDomainTextFormat : '%d',
                data: !config ? '' : config.data ? config.data : '',
                onClick: !config ? null : config.onClick ? config.onClick : false,
                start: !config ? new Date() : config.start ? config.start : new Date(),
                cellSize: !config ? 25 : config.cellSize ? config.cellSize : 25,
                rowLimit: !config ? 7 : config.rowLimit ? config.rowLimit : 7,
                range: !config ? 3 : config.range ? config.range : 3,
                domainGutter: !config ? 10 : config.domainGutter ? config.domainGutter : 10,
                legend: !config ? [5, 10, 15, 20] : config.legend ? config.legend : [5, 10, 15, 20],
                legendMargin:  !config ? 0 : config.legendMargin ? config.legendMargin : 0,
                itemName: !config ? 'item' : config.itemName ? config.itemName : 'item'
            });
            scope.$watchCollection('config.data', function (value) {
                cal.update(value);
            });
        }

        return {
            template: '<div id="cal-heatmap" config="config"></div>',
            restrict: 'E',
            link: link,
            scope: {config: '='}
        };
    });
