angular.module('profileModule').factory('profileService', ['$http', function ($http) {
    var profileService = {
        getBalance: function (personId){
            return $http.get("http://localhost:9095/api/account/balance/", {params:{"personId": personId}})
                .then(function success(res){
                    console.log(res.data);
                    return res.data;
                }, function error(res){
                    return res.data
                });
        },

        makeDeposit: function (depositElement) {
            return $http.post("http://localhost:9095/api/account/deposit/", depositElement)
                .then(function success(res) {
                    return res.data;
                }, function error(res) {
                    return res.data;
                })
        }

    };
    return profileService;
}]);