(function () {

    angular
        .module('app', ['nvd3'])
        .controller('SAEController', [
            SAEController
        ]);

    function SAEController() {
        var vm = this;
        
        var remediationData = [
            {
                key: "Cumulative Return",
                values: [
                    {
                        "label": "A",
                        "value": 29.765957771107
                    },
                    {
                        "label": "B",
                        "value": 0
                    },
                    {
                        "label": "C",
                        "value": 32.807804682612
                    },
                    {
                        "label": "D",
                        "value": 196.45946739256
                    },
                    {
                        "label": "E",
                        "value": 0.19434030906893
                    },
                    {
                        "label": "F",
                        "value": 98.079782601442
                    },
                    {
                        "label": "G",
                        "value": 13.925743130903
                    },
                    {
                        "label": "H",
                        "value": 5.1387322875705
                    }
                ]
            }
        ];
        
        var eventsData = [
            {
                key: "Cumulative Return",
                values: [
                    {
                        "label": "A",
                        "value": 19.765957771107
                    },
                    {
                        "label": "B",
                        "value": 10
                    },
                    {
                        "label": "C",
                        "value": 22.807804682612
                    },
                    {
                        "label": "D",
                        "value": 96.45946739256
                    },
                    {
                        "label": "E",
                        "value": 30.19434030906893
                    },
                    {
                        "label": "F",
                        "value": 78.079782601442
                    },
                    {
                        "label": "G",
                        "value": 73.925743130903
                    },
                    {
                        "label": "H",
                        "value": 45.1387322875705
                    }
                ]
            }
        ];

        vm.options = {
            chart: {
                type: 'discreteBarChart',
                height: 300,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 50,
                    left: 55
                },
                x: function (d) {
                    return d.label;
                },
                y: function (d) {
                    return d.value + (1e-10);
                },
                showValues: true,
                valueFormat: function (d) {
                    return d3.format(',.4f')(d);
                },
                duration: 500,
                xAxis: {
                    axisLabel: 'Date'
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    axisLabelDistance: -10
                }
            }
        };
        console.log();

        vm.changeGraph = function(type){
            if(type === 'remediation'){
                vm.data = remediationData;
                vm.graphTitle = 'Remediation Data';
                vm.options.chart.yAxis.axisLabel = 'Remediation';
            }else if(type === 'events'){
                vm.data = eventsData;
                vm.graphTitle = 'Events Data';
                vm.options.chart.yAxis.axisLabel = 'Events';
            }
        };
        
        function init(){
            vm.changeGraph('remediation');
        }
        init();
    }

})();
