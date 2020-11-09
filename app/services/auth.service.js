angular.module('Auth', [])

app.service('Auth', [
    '$http',
    function ($http) {
        var baseUrl = 'https://nodejs-rest-api.azurewebsites.net'

        this.signIn = function (credentials) {
            return $http.post(baseUrl + '/user/login', credentials)
        }

        this.signUp = function (payload) {
            return $http.post(baseUrl + '/user/signup', payload)
        }
    }
])
