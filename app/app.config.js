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
                    userData: function (userService, $q, $timeout) {
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
                resolve: {
                    userData: function (userService, $q, $timeout) {
                        var deferred = $q.defer()
                        /* with an async
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
                        controller: function ($scope, userData) {
                            $scope.user = userData.name
                        }
                    }
                }
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'signup/signup.html',
                controller: function ($scope, $state, userService) {
                    $scope.isLoading = false

                    $scope.signUp = function () {
                        $scope.isLoading = true
                        var userData = {
                            name: $scope.name,
                            email: $scope.email,
                            password: $scope.password
                        }

                        userService
                            .signUp(userData)
                            .then(function (response) {
                                console.log(response.data.message)
                                $scope.isLoading = false
                                $state.go('signin')
                            })
                            .catch(function (error) {
                                $scope.isLoading = false
                                console.log('Unable to register user')
                            })
                    }
                }
            })
            .state('signin', {
                url: '/signin',
                templateUrl: 'signin/signin.html',
                controller: function ($scope, $state, userService) {
                    $scope.isLoading = false

                    $scope.login = function (cred) {
                        $scope.isLoading = true
                        userService
                            .signIn(cred)
                            .then(function (user) {
                                $scope.isLoading = false
                                if (angular.isUndefined(user)) {
                                    console.log('Couldnt retrieve user')
                                } else {
                                    $state.go('root.home')
                                }
                            })
                            .catch(function (error) {
                                console.log(error.data.message)
                                $scope.isLoading = false
                                console.log('Invalid email or password')
                            })
                    }
                }
            })
    }
])
