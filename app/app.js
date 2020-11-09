angular
    .module('angularApp', ['ui.router'])
    .run(function ($rootScope, $state) {
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
    .service('Auth', Auth)
    .factory('userService', userService)
    .config(routes)

function userService(Auth) {
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
        signIn: function (userCredentials) {
            return Auth.signIn({ email: userCredentials.email, password: userCredentials.password }).then(function (
                response
            ) {
                userService.user = response.data
                return response.data
            })
        },
        logout: function () {
            userService.user = undefined
        }
    }

    return userService
}

function Auth($http) {
    var baseUrl = 'https://nodejs-rest-api.azurewebsites.net'

    this.signIn = function (credentials) {
        return $http.post(baseUrl + '/user/login', credentials)
    }

    this.signUp = function (payload) {
        return $http.post(baseUrl + '/user/signup', payload)
    }
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
                    templateUrl: 'home.html'
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
                    controller: function ($scope, userData) {
                        $scope.user = userData.name
                    }
                }
            }
        })
        .state('root.signup', {
            url: '/signup',
            views: {
                content: {
                    templateUrl: 'signup/signup.html'
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
                                $state.go('root.restricted')
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
