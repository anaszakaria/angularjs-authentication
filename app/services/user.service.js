angular.module('userService', [])

app.factory('userService', [
    'Auth',
    function (Auth) {
        var userService = {
            user: undefined,
            signIn: function (userCredentials) {
                return Auth.signIn({ email: userCredentials.email, password: userCredentials.password }).then(function (
                    response
                ) {
                    userService.user = response.data
                    return response.data
                })
            },
            signUp: function (userData) {
                return Auth.signUp(userData)
            },
            logout: function () {
                userService.user = undefined
            },
            getUser: function () {
                return userService.user
            }
        }

        return userService
    }
])
