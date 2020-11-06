angular
    .module('angularApp', ['ui.router'])
    .run(function ($rootScope, $state) {
        $state.defaultErrorHandler(function (error) {
            console.log(error.detail)
            switch (error.detail) {
                case 401:
                    console.log('Access is UnAuthorized')
                    $state.go('login')
                    break
                default:
                    $log.warn('$stateChangeError event catched')
                    break
            }
        })
    })
    .factory('userService', userService)
    .config(routes)

function userService() {
    var usersMock = {
        testUser: {
            username: 'testUser',
            password: '1234'
        },
        testUser2: {
            username: 'testUser2',
            password: '1234'
        }
    }
    var userService = {
        user: undefined,
        login: function (userCredentials) {
            // later --> $http.post('auth', userCredentials).then(...)
            // for demo use local data
            var user = usersMock[userCredentials.username]
            userService.user = user && user.password == userCredentials.password ? user : undefined
            return user
        },
        logout: function () {
            userService.user = undefined
        }
    }

    return userService
}
function routes($urlRouterProvider, $stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true)
    $urlRouterProvider.otherwise('/')

    $stateProvider
        .state('root', {
            url: '',
            abstract: true,
            resolve: {
                user: function (userService) {
                    return userService.user // would be async in a real app
                }
            },
            views: {
                '': {
                    templateUrl: 'layout.html'
                },
                'header@root': {
                    templateUrl: 'app-header.html',
                    controller: function ($scope, $state, user, userService) {
                        $scope.user = user
                        $scope.login = function () {
                            $state.go('login')
                        }
                        $scope.logout = function () {
                            userService.logout()
                            $state.go('root.home', {}, { reload: true })
                        }
                    }
                },
                'footer@root': {
                    template: '<p>footer view</p>'
                }
            }
        })
        .state('root.home', {
            url: '/',
            views: {
                content: {
                    template: 'Hello at home'
                }
            }
        })
        .state('root.about', {
            url: '/about',
            views: {
                content: {
                    template: 'about view'
                }
            }
        })
        .state('root.restricted', {
            url: '/restricted',
            resolve: {
                auth: function (userService, $q, $timeout) {
                    var deferred = $q.defer()
                    /* //with an async
                    return UserService.load().then(function(user){
                      if (permissionService.can(user, {goTo: state})) {
                        return deferred.resolve({});
                      } else {
                        return deferred.reject({redirectTo: 'some_other_state'});
                      }
                    }*/

                    $timeout(function () {
                        if (angular.isUndefined(userService.user)) {
                            return deferred.reject(401)
                        } else {
                            return deferred.resolve(userService.user)
                        }
                    })

                    return deferred.promise
                }
            },
            views: {
                content: {
                    templateUrl: 'admin.html',
                    controller: function ($scope, auth) {
                        $scope.user = auth.username
                    }
                }
            }
        })
        .state('login', {
            url: '/login',
            templateUrl: 'login.html',
            controller: function ($scope, $state, userService) {
                $scope.login = function (cred) {
                    var user = userService.login(cred)

                    if (angular.isUndefined(user)) {
                        alert('username or password incorrect.')
                    } else {
                        $state.go('root.restricted')
                    }
                }
            }
        })
}
