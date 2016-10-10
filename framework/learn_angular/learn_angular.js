// window.onload = function() {
//     var arr = 'sangyimin'.split('');

// };

var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
    // $scope.arr = 'sangyimin'.split('');
    // $scope.arr = ["sang", 'df'];
    // $scope.arr = ["s", "a", "n", "g", "y", "i", "m", "i", "n"];
    $scope.arr = '112233'.split('');
    $scope.a = 'a changed';
    var cnt = 0;
    $scope.changeHandler = function() {
        // $scope.a += cnt;
        // cnt++;
        // alert(1);
        $scope.arr = $scope.a.split('');
    };
    $scope.btnClick = function() {
        $scope.arr = 'world'.split('');
    };

    $scope.students = [{
        name: 'adam',
        age: 22
    }, {
        name: 'Duck',
        age: 11
    }, {
        name: "Haha",
        age: 99
    }];

});
app.directive('sym', function() {
    return {
        template: '<h1>sym是自定义指令</h1>',
    }
});
// ['', function() {
// // Runs during compile
// return {
//     // name: '',
//     // priority: 1,
//     // terminal: true,
//     // scope: {}, // {} = isolate, true = child, false/undefined = no change
//     // controller: function($scope, $element, $attrs, $transclude) {},
//     // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
//     // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
//     template: '<h1>sym是自定义指令</h1>',
//     // templateUrl: '',
//     // replace: true,
//     // transclude: true,
//     // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
//     // link: function($scope, iElm, iAttrs, controller) {

//     // }
// };
// }]);
