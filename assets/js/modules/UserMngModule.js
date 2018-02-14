var userMngModule = angular.module('UserMngModule', []);

userMngModule.controller('RegistrationController', ['$scope', function ($scope) {
    $scope.registerWithEmail = function () {
        console.log("email is " + $scope.email);
        console.log("password is " + $scope.password);
        console.log("password confirm is " + $scope.passwordConfirm);
    }
}]);

// userMngModule.controller('LogInController', ['$rootScope','$scope', 'AuthService', 'AUTH_EVENTS', function LogInController($rootScope, $scope, AuthService, AUTH_EVENTS) {

//     $scope.credentials = {
//         username: '',
//         password: ''
//     };

//     $scope.login = function (user) {
//         AuthService.login(user).then(function (data) {
//             console.log(AUTH_EVENTS.loginSuccess);
//             $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
//             $rootScope.currentUser = user;
//         }, function () {
//            $scope.$broadcast(AUTH_EVENTS.loginFailed);
//         });
//     };
// }]);
