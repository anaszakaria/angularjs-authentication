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
                views: {
                    '': {
                        templateUrl: 'layout.html'
                    },
                    'header@root': {
                        templateUrl: 'components/app-header.html',
                        controller: 'appHeaderController'
                    }
                }
            })
            .state('root.home', {
                url: '/',
                views: {
                    content: {
                        templateUrl: 'home/home.html',
                        controller: function ($scope, userData) {
                            $scope.user = userData
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
                        templateUrl: 'about/about.html'
                    }
                }
            })
            .state('root.profile', {
                url: '/profile',
                views: {
                    content: {
                        templateUrl: 'profile/profile.html',
                        controller: function ($scope, userData) {
                            $scope.user = userData
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
