(function() {
    console.log('ready');
})();
var json = {
    users: [{
        name: 'one',
        email: 'one@one.com',
        password: "111111"
    }, {
        name: 'two',
        email: 'two@two.com',
        password: "222222"
    }, {
        name: 'three',
        email: 'three@three.com',
        password: "333333"

    }]
};
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
    $scope.formType = 'signup';
    $scope.login = {};
    $scope.signup = {};
    $scope.isSignupValid = false;
    $scope.signupError = {};
    $scope.loginError = {};
    $scope.signupSubmit = function() {

        if ($scope.isValidForm('signup')) {
            console.log('pushed');
            json.users.push($scope.signup);

            $scope.isSignupValid = true;
            $scope.signupResult = {};
            angular.copy($scope.signup, $scope.signupResult);

            $scope.signup = {};
            $scope.signupError = {};
        } else {
            $scope.isSignupValid = false;

        }

    };
    $scope.loginSubmit = function() {
        // $scope.login.name =

        // console.log($scope.login);
        if ($scope.isValidForm('login')) {
            // console.log($scope.login.password);
            if ($scope.isPasswordMatch($scope.login.name, $scope.login.password)) {
                alert('欢迎回来:' + $scope.login.name);
                $scope.login = {};
            } else {
                $scope.loginError.password = '密码错误';
            }
        }

        // $scope.inputCheck('loginName');
        // 

    };
    $scope.isValidForm = function(formtype) {
        if (formtype === 'signup') {
            $scope.inputCheck('signupName');
            $scope.inputCheck('signupEmail');
            $scope.inputCheck('signupPassword');
            for (key in $scope.signupError) {
                if ($scope.signupError[key] !== "") {
                    return false;
                }
            }
            return true;
        } else if (formtype === 'login') {
            $scope.inputCheck('loginName');
            $scope.inputCheck('loginPassword');
            for (key in $scope.signupError) {
                if ($scope.signupError[key] !== "") {
                    return false;
                }
            }
            return true;

        }
    }
    $scope.inputCheck = function(key) {
        switch (key) {
            case 'signupName':
                $scope.signupError.name = '';
                if ($scope.signupForm.name.$invalid) {
                    $scope.signupError.name = '用户名必填';
                }
                if ($scope.isInJson('name', $scope.signup.name)) {
                    $scope.signupError.name = '用户名已存在';
                }
                break;
            case 'signupEmail':
                $scope.signupError.email = '';
                if ($scope.signupForm.email.$invalid) {
                    $scope.signupError.email = '无效的邮箱';
                }
                if ($scope.isInJson('email', $scope.signup.email)) {
                    $scope.signupError.email = '邮箱已存在';
                }
                break;
            case 'signupPassword':
                $scope.signupError.password = '';
                if ($scope.signupForm.password.$invalid) {
                    $scope.signupError.password = '密码不少于6位';
                }
                break;
            case 'loginName':
                $scope.loginError.name = '';
                if ($scope.loginForm.name.$invalid) {
                    $scope.loginError.name = '用户名必填';
                }
                if (!$scope.isInJson('name', $scope.login.name)) {
                    $scope.loginError.name = '用户名不存在';
                }

                break;
            case 'loginPassword':
                $scope.loginError.password = '';
                if ($scope.loginForm.password.$invalid) {
                    $scope.loginError.password = '密码不少于6位';
                }
                // if ($scope.isPasswordMatch($scope.login.name, $scope.login.password)) {
                //     alert('欢迎回来:' + login.name);
                // } else {
                //     $scope.loginError.password = '密码错误';
                // }

                break;

            default:
                break;

        }

    };

    $scope.isInJson = function(key, value) {
        for (var i = 0; i < json.users.length; i++) {
            if (json.users[i][key] == value) {
                return true;
            }
        }
        return false;
    }
    $scope.isPasswordMatch = function(name, password) {
        for (var i = 0; i < json.users.length; i++) {
            if (json.users[i].name === name) {
                console.log(json.users[i].password);
                console.log(json.users[i].password === password);
                return json.users[i].password === password;

            }
        }
        return false;

    }

});
