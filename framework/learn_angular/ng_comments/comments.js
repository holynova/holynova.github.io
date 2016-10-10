// window.onload = function() {
//     // unitTest();

// };

var json = {
    comments: []
};

(function() {
    for (var i = 0; i < 17; i++) {
        json.comments.push(getRandomComment());
    }
})();

var app = angular.module('myApp', []);
app.controller('myCtrl', ['$scope', '$filter', function($scope, $filter) {
    var numPerPage = 5;
    $scope.inputText = "默认留言";
    $scope.comments = json.comments;
    $scope.sortKey = 'time';
    $scope.reverse = false;

    $scope.addComment = function() {
        if ($scope.inputText == "") {
            alert('留言为空');
            return;
        }
        var comment = {};
        comment.time = new Date();
        comment.timeStr = DateToStr(comment.time);
        comment.content = $scope.inputText;
        comment.up = 0;
        $scope.comments.push(comment);
        // $scope.inputText = '';
        $scope.slicePage(numPerPage);
        $scope.sortBy('time', true);
    };

    $scope.delComment = function(item) {
        // console.log(item);
        $scope.comments.remove(item);
        $scope.slicePage(numPerPage);
    };
    $scope.upvote = function(item) {
        item.up++;
    };
    $scope.sortBy = function(key, reverse) {
        if (typeof reverse === 'undefined') {
            reverse = 'toggle';
        }
        $scope.sortKey = key;
        $scope.reverse = reverse === 'toggle' ? !$scope.reverse : reverse;
        $scope.comments = $filter('orderBy')($scope.comments, $scope.sortKey, $scope.reverse);
        // orderBy($scope.comments, $scope.sortKey, $scope.reverse);

    };
    // $scope.sortBy('time');
    $scope.slicePage = function(N) {
        var maxPage = Math.ceil($scope.comments.length / N);
        var pagemarks = [];
        for (var i = 1; i <= maxPage; i++) {
            pagemarks.push(i);

        }
        console.log(pagemarks);
        $scope.pagemarks = pagemarks;
    }
    $scope.slicePage(numPerPage);
    $scope.sortBy('time', true);
}]);

function unitTest() {
    console.log(DateToStr(new Date));
}

function DateToStr(date) {
    return date.getFullYear() + "年" +
        (date.getMonth() + 1) + '月' +
        date.getDate() + "日 " +
        toDouble(date.getHours()) + ':' +
        toDouble(date.getMinutes()) + ":" +
        toDouble(date.getSeconds());
}

function toDouble(num) {
    return num < 10 ? "0" + num : "" + num;
}

function getRandomComment() {
    var comment = {};
    comment.time = new Date(Date.now() - Math.random() * 24 * 3600 * 1000);
    comment.timeStr = DateToStr(comment.time);
    comment.content = getRandomStr();
    comment.up = randBetween(0, 20);
    return comment;
}

//获得随机的字符串
function getRandomStr() {
    var pool = "小院闲窗春己深,重帘未卷影沈沈,倚楼无语理瑶琴,远岫出山催薄暮,细风吹雨弄轻阴,梨花欲谢恐难禁,淡荡春光寒食天,玉炉沈水袅残烟,梦回山枕隐花钿,海燕未来人斗草,江梅已过柳生绵,黄昏疏雨湿秋千,髻子伤春慵更梳,晚风庭院落梅初,淡云来往月疏疏,玉鸭薰炉闲瑞脑,朱樱斗帐掩流苏,通犀还解辟寒无".split(',');
    var arr = [];
    for (var i = 0; i < randBetween(1, 10); i++) {
        arr.push(pool[randBetween(0, pool.length - 1)]);
    }
    return arr.join('，') + '。';
}

function randBetween(start, end) {
    return start + parseInt(Math.random() * (end - start));
}
