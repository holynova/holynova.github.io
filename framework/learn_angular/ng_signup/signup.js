(function() {
    console.log('ready');
})();

var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
    $scope.formType = 'signup';
    $scope.login = {};
    $scope.signup = {};
    $scope.signupSubmit = function() {
        console.log($scope.signup);
        console.log('submit');
    };
    $scope.loginSubmit = function() {
        console.log($scope.login);
    }

});
