(function () {
    'use strict';
    angular.module('tradingPitModule').controller('pitController', ['$scope', 'tradingPitService', '$cookies',
        function pitController($scope, tradingPitService, $cookies) {

            $scope.initSummaryTab = function(){
                tradingPitService.getQuotes().then(function (res) {
                    $scope.quotes = res.data;
                },
                    function (res) {
                        console.log("Error while retrieving quotes");
                    });
            };

            $scope.initAllOrdersTab = function () {
                tradingPitService.getAllOrders().then(function (res) {
                    $scope.orders = res.data;
                },
                    function (res) {
                        console.log("Error while retrieving orders");
                    })
            };

            $scope.updateOrderSelection = function (order) {
                $scope.orderToSatisfy = order;

                $scope.satisfactionAction = order.type == "BUY"? "SELL" : "BUY";
                $scope.satisfactionStock = order.stock.stockId;
                $scope.satisfactionUnits = order.units;
                $scope.satifactionPrice = order.price;
            };

            $scope.respondToOrder = function(){
                if($scope.originalUnits <  $scope.orderToSatisfy.units){
                    console.log("Cannot satisfy more than was ordered");
                    return;
                };

                var orderResponse = {
                    personId: $cookies.getObject("authToken").person.personId,
                    orderId: $scope.orderToSatisfy.orderId,
                    type: $scope.satisfactionAction,
                    stockId: $scope.satisfactionStock,
                    units: $scope.satisfactionUnits,
                    price: $scope.satifactionPrice
                };

                console.log(orderResponse);

                 tradingPitService.sendResponse(orderResponse);
            }

        }]);

})();