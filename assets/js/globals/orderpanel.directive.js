angular.module("app").directive("orderPanel", ["AccountService", "$rootScope", "$cookies", "$http",
    function (AccountService, $rootScope, $cookies, $http) {
        return {
            templateUrl: '/partials/orderpanel.html',
            controller: function ($scope) {
                $scope.placeOrder = function () {
                    var authToken = $cookies.getObject("authToken");
                    var order = {
                        personId: authToken.person.personId,
                        type: $scope.orderType,
                        stock: $scope.stock,
                        units: $scope.units,
                        price: $scope.price
                    };

                    console.log(order);
                    $http.post("http://localhost:9095/api/trade/order", order)
                        .then(function success(resp) {
                            console.log(resp.config.data);
                        },
                        function fail() {
                            console.log(resp);
                        })
                    // console.log(authToken.person);
                    // console.log($scope.orderType);
                    // console.log($scope.stock);
                    // console.log($scope.units);
                    //AccountService.checkLoginTest();
                };
            }
        };
    }]);