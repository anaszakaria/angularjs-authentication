angular.module('employeeDetail', [])

app.controller('employeeDetailController', [
    '$scope',
    '$stateParams',
    'employeeService',
    function ($scope, $stateParams, employeeService) {
        $scope.isLoading = true
        $scope.isNotFound = false

        setTimeout(function () {
            employeeService.getEmployeeById($stateParams.employeeId).then(function (response) {
                if (response.data) {
                    $scope.employee = response.data
                } else {
                    $scope.isNotFound = true
                }
                $scope.isLoading = false
            })
        }, 250)
    }
])
