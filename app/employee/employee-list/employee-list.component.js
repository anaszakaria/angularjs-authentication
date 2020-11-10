angular.module('employeeList', [])

app.controller('employeeListController', [
    '$scope',
    'employeeService',
    function ($scope, employeeService) {
        $scope.isLoading = true

        setTimeout(function () {
            employeeService.getEmployees().then(function (response) {
                $scope.employees = response.data
                $scope.isLoading = false
            })
        }, 500)
    }
])
