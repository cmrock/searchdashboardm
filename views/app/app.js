
/**
 * Created by Hitesh on 21-10-2016.
 */

var app = angular.module('myapp', ['ngRoute','UserValidation','UserValidation1']);
app.controller("HelloController", function($scope) {
    //var path = $location.path();
} );
function registerController($scope) {
    $scope.password = '';
    $scope.changepassword = '';
}
/*/!* Directives *!/
angular.module('myapp.directives', [])
    .directive('pwCheck', [function () {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var firstPassword = '#' + attrs.pwCheck;
                elem.add(firstPassword).on('keyup', function () {
                    scope.$apply(function () {
                        // console.info(elem.val() === $(firstPassword).val());
                        ctrl.$setValidity('pwmatch', elem.val() === $(firstPassword).val());
                    });
                });
            }
        }
    }]);*/

angular.module('UserValidation', []).directive('validPasswordC', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue, $scope) {
                var noMatch = viewValue != scope.register.password.$viewValue
                ctrl.$setValidity('noMatch', !noMatch)
            })
        }
    }
})


angular.module('UserValidation1', []).directive('validPasswordC1', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue, $scope) {
                var noMatch = viewValue != scope.changepass.changepassword.$viewValue
                ctrl.$setValidity('noMatch', !noMatch)
            })
        }
    }
})

// Start Controller
/*app.config(function($routeProvider) {
    $routeProvider

        /!*.when('/', {
            templateUrl : 'Home.ejs'
            //controller  : 'HomeController'
        })*!/
        .when('/', {
            templateUrl : 'Home.ejs'
            //controller  : 'HomeController'
        })
        .when('/register', {
            templateUrl : 'Register.ejs'
            //controller  : 'BlogController'
        })

        .when('/login', {
            templateUrl : 'Login.ejs'
            //controller  : 'AboutController'
        })

        .when('/admin', {
            templateUrl : 'admin.html'
            //controller  : 'AboutController'
        })
        .otherwise({redirectTo: '/'});
});*/

