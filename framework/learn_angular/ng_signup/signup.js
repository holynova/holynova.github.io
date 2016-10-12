(function() {
    console.log('ready');
})();

var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
    // console.log('angular');
    $scope.formType = 'signup';
});
