angular.module('employeeService', [])

app.config([
    'employeeServiceProvider',
    function (userServiceProvider) {
        userServiceProvider.config('https://jsonplaceholder.typicode.com')
    }
])

app.provider('employeeService', function () {
    var baseURL = ''
    this.config = function (url) {
        baseURL = url
    }

    this.$get = [
        '$http',
        '$log',
        function ($http, $log) {
            var oEmployeeService = {}

            oEmployeeService.getEmployees = function () {
                return $http({
                    url: baseURL + '/users',
                    method: 'GET'
                })
            }

            oEmployeeService.getEmployeeById = function (id) {
                return $http({
                    url: baseURL + '/users/' + id,
                    method: 'GET'
                })
            }

            return oEmployeeService
        }
    ]
})
