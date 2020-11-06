'use strict'

app.controller('signUpController', [
    '$scope',
    '$state',
    function ($scope, $state) {
        $scope.isLoading = false

        $scope.signUp = function () {
            $scope.isLoading = true
            var userData = {
                name: $scope.name,
                email: $scope.email,
                password: $scope.password
            }
            // Auth.signUp(userData).then(function (response) {
            //     console.log(response.data.message)
            //     $scope.isLoading = false
            //     $state.go('signin')
            // })
        }
    }
])
