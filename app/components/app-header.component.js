app.controller('appHeaderController', [
    '$scope',
    '$state',
    'userService',
    function ($scope, $state, userService) {
        $scope.user = userService.getUser()
        $scope.login = function () {
            $state.go('signin')
        }
        $scope.logout = function () {
            userService.logout()
            $state.go('signin', {}, { reload: true })
        }
    }
])
