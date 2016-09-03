// window.onload = function() {
//     var arr = 'sangyimin'.split('');

// };

var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
    // $scope.arr = 'sangyimin'.split('');
    // $scope.arr = ["sang", 'df'];
    // $scope.arr = ["s", "a", "n", "g", "y", "i", "m", "i", "n"];
    $scope.arr = 'sangtyim'.split('');
    $scope.a = 'a changed';
    var cnt = 0;
    $scope.changeHandler = function() {
        $scope.a += cnt;
        cnt++;
        // alert(1);
    };
    $scope.btnClick = function() {
        $scope.arr = 'world'.split('');
    }
});
