angular.module('profileModule').controller('profileController', ['$rootScope', '$scope', '$cookies', 'profileService',
    function ($rootScope, $scope, $cookies, profileService) {

        var authToken = $cookies.getObject("authToken");

        $scope.getBalance = function getBalance(){
            if(!authToken){
                 $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                return;
            }
            profileService.getBalance(authToken.person.personId).then(function success(data){
                $scope.balance = data.balance;
            }, function error(data){

            });
        }
        
        $scope.makeDeposit = function () {
            
            var depositElement = {
                personId: $cookies.getObject("authToken").person.personId,
                amount: $scope.depositAmount
            };

            //console.log(depositElement);

            profileService.makeDeposit(depositElement).then(function success(data) {
                //console.log(data);
                $scope.balance = data.balance;
                $scope.depositAmount = "";
                depositElement=null;
            }, function error(data) {
                console.log(data);
                $scope.balance = data.balance;
                $scope.depositAmount = "";
            });
        };
    }]);