// window.onload = function() {
//     // unitTest();

// };

var json = {
    comments: [],
    users: []
};

(function() {
    for (var i = 0; i < 20; i++) {
        json.users.push(getRandomUser());
    }
    for (var i = 0; i < 107; i++) {

        json.comments.push(getRandomComment());
    }
})();

var app = angular.module('myApp', []);
app.controller('myCtrl', ['$scope', '$filter', function($scope, $filter) {
    $scope.numPerPage = 10;
    $scope.inputText = "写下你的评论";
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
        $scope.slicePage($scope.numPerPage);
        $scope.sortBy('time', true);
    };

    $scope.delComment = function(item) {
        // console.log(item);
        $scope.comments.remove(item);
        $scope.slicePage($scope.numPerPage);
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
        // 排序完成后页码回到1
        $scope.toPage(1);

    };
    // $scope.sortBy('time');
    $scope.slicePage = function(N) {
        var maxPage = Math.ceil($scope.comments.length / N);
        var pagemarks = [];
        for (var i = 1; i <= maxPage; i++) {
            pagemarks.push(i);

        }
        $scope.pagemarks = pagemarks;
        //重新切分页面后 页码回到1
        $scope.toPage(1);
    }
    $scope.activePage = 1;
    $scope.curPageFirstIndex = 0;
    $scope.bookmarkBegin = 0;
    $scope.toPage = function(N) {
        // 改变页码的选中状态
        if (N == "prev") {
            $scope.activePage = Math.max(1, $scope.activePage - 1);

        } else if (N == 'next') {
            $scope.activePage = Math.min($scope.activePage + 1, Math.ceil($scope.comments.length / $scope.numPerPage));

        } else {
            $scope.activePage = N;
            if (N > 10) {

            }
        }
        // 改变显示内容

        $scope.curPageFirstIndex = ($scope.activePage - 1) * $scope.numPerPage;

    }

    $scope.slicePage($scope.numPerPage);
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
    comment.user = json.users[randBetween(0, json.users.length - 1)];
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

function getRandomUser() {
    var pool = 'Jacob,Michael,Matthew,Joshua,Christopher,Nicholas,Andrew,Joseph,Daniel,Daniel,Tyler,Brandon,Ryan,Austin,William,John,David,Zachary,Anthony,James,Justin,Alexander,Jonathan,Dylan,Christian,Noah,Robert,Samuel,Kyle,Benjamin,Jose,Jordan,Kevin,Thomas,Nathan,Cameron,Hunter,Ethan,Aaron,Eric,Jason,Caleb,Logan,Brian,Luis,Adam,Juan,Steven,Jordan,Cody,Gabriel,Connor,Timothy,Charles,Isaiah,Jack,Carlos,Jared,Sean,Alex,Evan,Elijah,Richard,Patrick,Nathaniel,Isaac,Seth,Trevor,Angel,Luke,Devin,Bryan,Jesus,Mark,Ian,Mason,Cole,Adrian,Chase,Jeremy,Dakota,Garrett,Antonio,Jackson,Jesse,Blake,Dalton,Tanner,Stephen,Alejandro,Kenneth,Miguel,Victor,Lucas,Spencer,Bryce,Paul,Brendan,Jake,Tristan,Jeffrey,Leslie,Marcus'.split(',');
    var user = {};
    user.name = pool[randBetween(0, pool.length - 1)] + " " + pool[randBetween(0, pool.length - 1)];
    user.avatar = 'img/' + randBetween(1, 9) + '.png';
    return user;

}
