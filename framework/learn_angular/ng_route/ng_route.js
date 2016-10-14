var app = angular.module('myRouteApp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        template: '<h1>这里是首页</h1>'
    }).when('/comments', {
        templateUrl: "../ng_comments/index.html"
    }).when('/login', {
        template: "<h1>这里是注册页面</h1>"
    }).otherwise({
        redirectTo: '/'
    });
}]);

app.controller('myCtrl', function($scope) {

});
