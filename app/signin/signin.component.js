'use strict'

app.controller('signInController', [
    '$scope',
    '$state',
    function ($scope, $state) {
        $scope.isLoading = false

        $scope.signIn = function () {
            $scope.isLoading = true
            // Auth.signIn({ email: $scope.email, password: $scope.password })
            //     .then(function (response) {
            //         // user successfully authenticated, refresh UserProfile
            //         $scope.isLoading = false
            //         return userProfile.$updateProfile(response.data)
            //     })
            //     .then(function () {
            //         // UserProfile is refreshed, redirect user somewhere
            //         $state.go('root')
            //     })
        }
    }
])
