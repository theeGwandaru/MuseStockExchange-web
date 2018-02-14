var app = angular.module('app', ['ngRoute', 'ngCookies', 'tradingPitModule', 'companyModule', 'profileModule']);

app.constant(
    'AUTH_EVENTS', {
        registrationSuccess: 'registration-success',
        registrationFailed: 'registration-failed',
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    }
);

app.constant('USER_ROLES', {
    all: '*',
    admin: 'ADMIN',
    user: 'USER'
});

app.config(['$httpProvider', '$locationProvider', '$routeProvider', 'USER_ROLES', function ($httpProvider, $locationProvider, $routeProvider, USER_ROLES) {
    $locationProvider.hashPrefix('!');

    $httpProvider.interceptors.push('HttpInterceptor');

    $routeProvider.when('/', { templateUrl: '/partials/home.html' })
        .when('/tradingpit', { templateUrl: '/partials/tradingpit.html' })
        .when('/company', { templateUrl: '/partials/company.html' })
        .when('/profile', { templateUrl: '/partials/profile.html', /*authorizedRolesRequired: { authorizedRoles: [USER_ROLES.user] }*/ })
        .otherwise({ redirectTo: '/' });
}]).run(['$rootScope', '$location', 'AccountService', 'AUTH_EVENTS', function ($rootScope, $location, AccountService, AUTH_EVENTS) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if (next.authorizedRolesRequired) {
            if (!AccountService.isAuthorized(next.authorizedRolesRequired.authorizedRoles)) {
                event.preventDefault();
                if (AccountService.isAuthenticated()) {
                    // user is not allowed
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                    console.log("not authorized");
                } else {
                    // user is not logged in

                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                    console.log("not logged in");
                }
            }
        }



    });
}]);

app.controller('applicationController', ['$rootScope', '$cookies', '$scope', '$location', 'AUTH_EVENTS', 'USER_ROLES', 'AccountService', 'Session',
    applicationController]);

function applicationController($rootScope, $cookies, $scope, $location, USER_ROLES, AUTH_EVENTS, AccountService, Session) {
    $scope.currentUser = $cookies.getObject("authToken");
    
    if ($scope.currentUser)
        Session.create($scope.currentUser.authToken, $scope.currentUser.authId, $scope.currentUser.authPermission);

    registerEvents($rootScope, $scope, $cookies, $location, USER_ROLES, AUTH_EVENTS);

    $scope.register = function (credentials) {
        AccountService.register(credentials).then(function (data) {

            // $cookies.putObject('authToken', data);
        }, function (res) {
            console.log(res);
        });
    };

    $scope.login = function (user) {
        AccountService.login(user).then(function (data) {
            //$cookies.putObject('authToken', data);
        }, function (res) {
            console.log(res);
        });
    };

    $scope.logout = function logout() {
        AccountService.logout().then(function (data) {
            console.log('log out cliked');
        }, function (res) {
            console.log(res);
        });
    };

   

    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = AccountService.isAuthorized;
};

function registerEvents($rootScope, $scope, $cookies, $location, USER_ROLES, AUTH_EVENTS) {
    $scope.$on('serviceUnavailable', function (event, data) {
        angular.element(document.querySelector('#somethingWrongModal')).modal('show');
    });

    $scope.$on('auth-not-authenticated', function (event, data) {
        console.log(AUTH_EVENTS.notAuthenticated);
        angular.element(document.querySelector('#loginModal')).modal('show');
    });

    $scope.$on('loginSuccess', function (event, data) {
        console.log("log in succesful");
        $scope.currentUser = $cookies.getObject("authToken");
        angular.element(document.querySelector('#loginModal')).modal('hide');
        angular.element(document.querySelector('#loginSuccessModal')).modal('show');
    });

    $scope.$on('loginFailed', function (event, data) {
        console.log("log in failed: for real?");
    });

    $scope.$on('registrationSuccess', function (event, data) {
        console.log("Registration succesful");
        $scope.currentUser = $cookies.getObject("authToken");
        angular.element(document.querySelector('#registerModal')).modal('hide');
        angular.element(document.querySelector('#registrationSuccessModal')).modal('show');
    });

    $scope.$on('registrationFailed', function (event, data) {
        console.log("log in failed");
    });

    $scope.$on('logoutSuccess', function (event, data) {
        $scope.currentUser = null;
         $location.url("/");
        angular.element(document.querySelector('#logoutmodal')).modal('show');
    });
}


app.directive('showtab',
    function () {
        return {
            link: function (scope, element, attrs) {
                element.click(function (e) {
                    e.preventDefault();
                    $(element).tab('show');
                });
            }
        };
    });
