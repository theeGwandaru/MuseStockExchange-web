(function () {
    'use strict';
    angular.module('companyModule').controller('companyController', ['$scope', '$element', companyController]);

    function companyController($scope, $element) {
        $scope.showSummary = function () {
            function randomIntFromInterval(min, max) {
                return Math.floor(Math.random() * (max - min + 1) + min);
            }

            function getYieldData() {
                //We randomly generate data
                var dailyYields = { data: [] };
                var effectiveYields = [];
                var today = Date.now();
                var dateOffSet = 24 * 60 * 60 * 1000;


                for (var i = (365 * 0.125); i >= 0; i--) {
                    var dYield = randomIntFromInterval(5, 25);
                    var eYield = dYield + Math.random();

                    dailyYields.data.push({
                        date: new Date(today - dateOffSet * i),
                        dYield: dYield,
                        eYield: eYield
                    });
                }

                return dailyYields;

            }

            function getPreppedData(dailyYields) {
                return [{ key: "Daily Yield", values: dailyYields.data.map(function (elem) { return { x: elem.date, y: elem.dYield }; }) },
                    { key: "Effective Yield", values: dailyYields.data.map(function (elem) { return { x: elem.date, y: elem.eYield }; }) }
                ];
            }

            nv.addGraph(function () {
                var chart = nv.models.lineWithFocusChart();
                // chart.x(function (d) {
                //     console.log(d.x);
                //     return new Date(d.x);
                // });
                chart.xScale(d3.time.scale());
                chart.xAxis.tickFormat(function (d) { return d3.time.format("%d-%m-%Y")(new Date(d)); });
                chart.x2Axis.tickFormat(function (d) { return d3.time.format("%d-%m-%Y")(new Date(d)); });
                chart.yTickFormat(d3.format(",.2f"));
                chart.useInteractiveGuideline(true);

                d3.select("#chart svg").datum(getPreppedData(getYieldData())).call(chart);
                nv.utils.windowResize(chart.update);
                return chart;
            });
        };
    };

})();