(function() {
    console.log('ready');
})();
var json = {
    users: [{
        name: 'one',
        email: 'one@one.com',
        password: 111111
    }, {
        name: 'two',
        email: 'two@two.com',
        password: 222222
    }, {
        name: 'three',
        email: 'three@three.com',
        password: 333333
    }]
};
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
    $scope.formType = 'signup';
    $scope.login = {};
    $scope.signup = {};
    $scope.isSignupValid = false;
    $scope.signupSubmit = function() {
        // console.log($scope.signup);

        json.users.push($scope.signup);
        $scope.isSignupValid = true;
        $scope.signupResult = {};
        console.log(json.users);
        angular.copy($scope.signup, $scope.signupResult);
        // $scope.result.name = $scope.signup.name;
        // $scope.result.email = $scope.signup.email;
        $scope.signup = {};

    };
    $scope.loginSubmit = function() {
        console.log($scope.login);
    }
    $scope.findJSON(key, value) {
        for (var i = 0; i < json.users)
    }

});
