'use strict'

app.controller('signUpController', [
    '$scope',
    '$state',
    'userService',
    function ($scope, $state, userService) {
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
])
