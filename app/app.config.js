app.component('appHeader', {
    templateUrl: 'components/app-header.template.html',
    controller: function () {
        this.status = true
    }
})

app.component('leftPanel', {
    templateUrl: 'components/left-panel.template.html',
    controller: function () {
        this.status = true
    }
})

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(true)

        $stateProvider
            .state('root', {
                url: '/',
                templateUrl: 'home/home.template.html'
            })
            .state('signin', {
                url: '/signin',
                templateUrl: 'signin/signin.template.html',
                controller: 'signInController',
                resolve: {
                    userProfile: 'UserProfile'
                }
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'signup/signup.template.html',
                controller: 'signUpController'
            })
            .state('admin', {
                url: '/admin',
                templateUrl: 'admin/admin.template.html',
                resolve: {
                    access: [
                        'Access',
                        function (Access) {
                            return Access.hasRole('ROLE_ADMIN')
                        }
                    ]
                }
            })
            .state('userlist', {
                url: '/userlist',
                templateUrl: 'user/user-list/user-list.template.html',
                controller: 'userListController',
                resolve: {
                    access: [
                        'Access',
                        function (Access) {
                            return Access.isAuthenticated()
                        }
                    ],
                    userProfile: 'UserProfile'
                },
                data: {
                    protected: true
                }
            })
            .state('userdetail', {
                url: '/userdetail/:userId',
                templateUrl: 'user/user-detail/user-detail.template.html',
                controller: 'userDetailController',
                access: [
                    'Access',
                    function (Access) {
                        return Access.isAuthenticated()
                    }
                ]
            })
            .state('error404', {
                url: '*path',
                template: '<h3>Error 404 - Page Not Found</h3>'
            })

        // redirect if no route is found
        // $urlRouterProvider.otherwise('/error404')
    }
])

app.run([
    '$rootScope',
    '$state',
    '$transitions',
    '$timeout',
    '$log',
    'Access',
    function ($rootScope, $state, $transitions, $timeout, $log, Access) {
        $state.defaultErrorHandler(function (error) {
            console.log(error.detail)
            switch (error.detail) {
                case 401:
                    console.log('Access is UnAuthorized')
                    $state.go('signin')
                    break
                case 403:
                    console.log('Access is Forbidden')
                    $state.go('signin')
                    break
                default:
                    $log.warn('$stateChangeError event catched')
                    break
            }
        })
    }
])
