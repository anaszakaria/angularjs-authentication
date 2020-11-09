'use strict'

app.controller('signInController', [
    '$scope',
    '$state',
    'userService',
    function ($scope, $state, userService) {
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
])
