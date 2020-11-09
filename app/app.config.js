app.run(function ($rootScope, $state) {
    $state.defaultErrorHandler(function (error) {
        switch (error.detail) {
            case 401:
                console.log('Access is UnAuthorized')
                $state.go('signin')
                break
            default:
                $log.warn('$stateChangeError event catched')
                break
        }
    })
})

app.config([
    '$urlRouterProvider',
    '$stateProvider',
    '$locationProvider',
    function ($urlRouterProvider, $stateProvider, $locationProvider) {
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
                                $state.go('signin')
                            }
                            $scope.logout = function () {
                                userService.logout()
                                $state.go('signin', {}, { reload: true })
                            }
                        }
                    }
                }
            })
            .state('root.home', {
                url: '/',
                views: {
                    content: {
                        templateUrl: 'home.html',
                        controller: function ($scope, userData) {
                            $scope.user = userData.name
                        }
                    }
                },
                resolve: {
                    userData: routeGuard
                }
            })
            .state('root.about', {
                url: '/about',
                views: {
                    content: {
                        templateUrl: 'about.html'
                    }
                }
            })
            .state('root.restricted', {
                url: '/restricted',
                views: {
                    content: {
                        templateUrl: 'admin.html',
                        controller: function ($scope, userData) {
                            $scope.user = userData.name
                        }
                    }
                },
                resolve: {
                    userData: routeGuard
                }
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'signup/signup.html',
                controller: 'signUpController'
            })
            .state('signin', {
                url: '/signin',
                templateUrl: 'signin/signin.html',
                controller: 'signInController'
            })
    }
])

function routeGuard(userService, $q, $timeout) {
    var deferred = $q.defer()

    $timeout(function () {
        if (angular.isUndefined(userService.user)) {
            return deferred.reject(401)
        } else {
            return deferred.resolve(userService.user)
        }
    })

    return deferred.promise
}
