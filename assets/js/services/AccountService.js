angular.module('app').service('Session', function () {
    this.create = function (sessionId, userId, userRole) {
        this.id = sessionId;
        this.userId = userId;
        this.userRole = userRole;
    };
    this.destroy = function () {
        this.id = null;
        this.userId = null;
        this.userRole = null;
    };
});

angular.module('app').factory('AccountService', ['$rootScope', '$cookies', '$http', 'Session',
    function ($rootScope, $cookies, $http, Session) {
        var AccountService = {};

        AccountService.register = function (credentials) {
            delete credentials.passwordConfirm;
            return $http.post('http://localhost:9095/api/auth/register', credentials)
                .then(function (res) {
                  
                    Session.create(res.data.tokenId, res.data.person.credential.userName, res.data.person.credential.role);
                    $cookies.putObject('authToken', res.data);
                    $rootScope.$broadcast('registrationSuccess');
                    return res.data;
                }, function (res) {
                    if (res.status == 503) {
                        $rootScope.$broadcast('serviceUnavailable');
                    }
                    else {
                        $scope.$broadcast('registrationFailed');
                        return res;
                    }
                });
        };

        AccountService.login = function (credentials) {
            return $http.post('http://localhost:9095/api/auth/login', credentials)
                .then(function (res) {
                      console.log(res.data);
                    Session.create(res.data.tokenId, res.data.person.credential.userName, res.data.person.credential.role);
                    $cookies.putObject('authToken', res.data);
                    $rootScope.$broadcast('loginSuccess');
                    return res.data;
                }, function (res) {
                    if (res.status == 503) {
                        $rootScope.$broadcast('serviceUnavailable');
                    }
                    else {
                        $rootScope.$broadcast('loginFailed');
                    }
                    return res;
                });
        };

        AccountService.logout = function logout() {
            console.log($cookies.getObject('authToken'));
            return $http.post('http://localhost:9095/api/auth/logout', $cookies.getObject('authToken'))
                .then(function (res) {
                    $cookies.remove('authToken');
                    Session.destroy();
                    $rootScope.$broadcast('logoutSuccess');
                    return res.data;
                }, function (res) {
                    $cookies.remove('authToken');
                    return res;
                });
        };

        AccountService.checkLoginTest = function () {
            return $http.post('http://localhost:9095/api/auth/checkLoginStatus')
                .then(function (res) {
                    //console.log(res); 
                },
                function (res) {
                    //console.log(res); 
                });
        }

        AccountService.isAuthenticated = function () {
            return !!Session.userId;
        };

        AccountService.isAuthorized = function (authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            return (AccountService.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1);
        };

        return AccountService;
    }]);




angular.module('app').factory('HttpInterceptor', ['$cookies', '$rootScope', function ($cookies, $rootScope) {
    var interceptor = {
        'request': function (config) {
            var cookie = $cookies.getObject('authToken');
            if (cookie)
                config.headers['token'] = JSON.stringify(cookie);
            return config;
        },
        'response': function (response) {
            return response;
        },
        'responseError': function (response) {
            if (response.status == 401) {
                $rootScope.$broadcast("auth-not-authenticated");
                console.log(response.status);
            }
            if (response.status == 403) {
                $rootScope.$broadcast("auth-not-authorized");
            }
            if (response.status == 500 || response.status == 503) {
                $rootScope.$broadcast('serviceUnavailable');
            }
            return response;
        }
    };
    return interceptor;
}]);