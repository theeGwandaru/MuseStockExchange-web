angular.module("app").factory("tradingPitService", ['$http', function($http){
    var tradingPitService = {

        getQuotes: function(){
             return $http.get("http://localhost:9095/api/trade/quotes/")
            .then(function success(res){
                //console.log(res);
                return res;
            },
            function error(res){
                //console.log(res);
                return res;
            });
        },

        getAllOrders: function(){

            return $http.get("http://localhost:9095/api/trade/orders/")
            .then(function success(res){
                console.log(res);
                return res;
            },
            function error(res){
                console.log(res);
                return res;
            });
        },

        sendResponse: function(orderResponse){
            return $http.post("http://localhost:9095/api/trade/orderResponse/", orderResponse)
            .then(function success(res){
                console.log(res);
                return res;
            },
            function error(res){
                console.log(res);
                return res;
            });
        }
    };
    
    return tradingPitService;

}]);