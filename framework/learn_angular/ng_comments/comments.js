// window.onload = function() {
//     // unitTest();
// };
var json = {
    comments: [],
    users: []
};
(function() {
    createJSON();
})();
var app = angular.module('myApp', []);
app.controller('myCtrl', ['$scope', '$filter', function($scope, $filter) {
    $scope.numPerPage = 5;
    $scope.inputText = "写下你的评论";
    $scope.comments = json.comments;
    $scope.users = json.users;
    $scope.sortKey = 'time';
    $scope.reverse = false;
    $scope.curUser = json.users[0];
    $scope.showTextarea = true;
    $scope.addComment = function() {
        if ($scope.inputText == "") {
            alert('留言为空');
            return;
        }
        var comment = {};
        comment.time = new Date();
        comment.timeStr = DateToStr(comment.time);
        comment.content = $scope.inputText;
        // .replace(/ /g, '&nbsp').replace(/\n/g, '<br/>');
        comment.up = 0;
        comment.user = $scope.curUser;
        $scope.comments.push(comment);
        $scope.inputText = '';
        $scope.slicePage($scope.numPerPage);
        $scope.sortBy('time', true);
    };
    $scope.delComment = function(item) {
        // console.log(item);
        var index = $scope.comments.indexOf(item);
        $scope.comments.splice(index, 1);
        // console.log(index);
        // $scope.slicePage($scope.numPerPage);
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
        if (isNaN(Number(N)) || N < 1) {
            N = 1;
        }
        var maxPage = Math.ceil($scope.comments.length / N);
        $scope.lastpage = maxPage;
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
        }
        $scope.bookmarkBegin = Math.floor(($scope.activePage - 1) / 10) * 10;
        // }
        $scope.curPageFirstIndex = ($scope.activePage - 1) * $scope.numPerPage;
    }
    $scope.slicePage($scope.numPerPage);
    $scope.sortBy('time', true);
}]);
// function unitTest() {
//     console.log(DateToStr(new Date));
// }
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

function randComment() {
    var comment = {};
    comment.time = new Date(Date.now() - Math.random() * 24 * 3600 * 1000);
    comment.timeStr = DateToStr(comment.time);
    comment.content = randStr();
    comment.up = randBetween(0, 20);
    comment.user = json.users[randBetween(0, json.users.length - 1)];
    return comment;
}
//获得随机的字符串
function randStr() {
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

function randUser() {
    var user = {};
    user.name = randName();
    user.avatar = 'img/' + randBetween(1, 9) + '.png';
    return user;
}
//language可选cn,en,rand
function randName(language) {
    if (typeof language === 'undefined') {
        language = 'rand';
    }
    var pool = {
        cn: {
            family: '赵,钱,孙,李,周,吴,郑,王,冯,陈,褚,卫,蒋,沈,韩,杨,朱,秦,尤,许,何,吕,施,张,孔,曹,严,华,金,魏,陶,姜,戚,谢,邹,喻,柏,水,窦,章,云,苏,潘,葛,奚,范,彭,郎,鲁,韦,昌,马,苗,凤,花,方,俞,任,袁,柳,酆,鲍,史,唐,费,廉,岑,薛,雷,贺,倪,汤,滕,殷,罗,毕,郝,邬,安,常,乐,于,时,傅,皮,卞,齐,康,伍,余,元,卜,顾,孟,平,黄,和,穆,萧,尹,姚,邵,舒,汪,祁,毛,禹,狄,米,贝,明,臧,计,伏,成,戴,谈,宋,茅,庞,熊,纪,屈,项,祝,董,杜,阮,蓝,闵,席,季,麻,强,贾,路,娄,危,江,童,颜,郭,梅,盛,林,刁,钟,徐,邱,骆,高,夏,蔡,田,樊,胡,凌,霍,虞,万,支,柯,咎,管,卢,莫,经,房,裘,缪,干,解,应,宗,宣,丁,贲,邓,郁,单,杭,洪,包,诸,左,石,崔,吉,钮,龚,程,嵇,邢,滑,裴,陆,荣,翁,荀,羊,於,惠,甄,加,封,芮,羿,储,靳,汲,邴,糜,松,井,段,富,巫,乌,焦,巴,弓,牧,隗,山,谷,车,侯,宓,蓬,全,郗,班,仰,秋,仲,伊,宫,宁,仇,栾,暴,甘,钭,厉,戎,祖,武,符,刘,詹,束,龙,叶,幸,司,韶,郜,黎,蓟,薄,印,宿,白,怀,蒲,台,从,鄂,索,咸,籍,赖,卓,蔺,屠,蒙,池,乔,阴,胥,能,苍,双,闻,莘,党,翟,谭,贡,劳,逄,姬,申,扶,堵,冉,宰,郦,雍,璩,桑,桂,濮,牛,寿,通,边,扈,燕,冀,郏,浦,尚,农,温,别,庄,晏,柴,瞿,阎,充,慕,连,茹,习,宦,艾,鱼,容,向,古,易,慎,戈,廖,庚,终,暨,居,衡,步,都,耿,满,弘,匡,国,文,寇,广,禄,阙,东,殳,沃,利,蔚,越,夔,隆,师,巩,厍,聂,晁,勾,敖,融,冷,訾,辛,阚,那,简,饶,空,曾,毋,沙,乜,养,鞠,须,丰,巢,关,蒯,相,查,后,红,游,竺,权,逯,盖,益,桓,公,晋,楚,法,汝,鄢,涂,钦,缑,亢,况,有,商,牟,佘,佴,伯,赏,墨,哈,谯,笪,年,爱,阳,佟,琴,言,福,百,家,姓,续,岳,帅,,第五,梁丘,左丘,东门,百里,东郭,南门,呼延,万俟,南宫,段干,西门,司马,上官,欧阳,夏侯,诸葛,闻人,东方,赫连,皇甫,尉迟,公羊,澹台,公冶,宗政,濮阳,淳于,仲孙,太叔,申屠,公孙,乐正,轩辕,令狐,钟离,闾丘,长孙,慕容,鲜于,宇文,司徒,司空,亓官,司寇,子车,颛孙,端木,巫马,公西,漆雕,壤驷,公良,夹谷,宰父,微生,羊舌'.split(','),
            name: "梁,栋,维,启,克,伦,翔,旭,鹏,泽,晨,辰,士,以,建,家,致,树,炎,盛,雄,琛,钧,冠,策,腾,楠,榕,风,航,弘,义,兴,良,飞,彬,富,和,鸣,朋,斌,行,时,泰,博,磊,民,友,志,清,坚,庆,若,德,彪,伟,刚,勇,毅,俊,峰,强,军,平,保,东,文,辉,力,明,永,健,世,广,海,山,仁,波,宁,福,生,龙,元,全,国,胜,学,祥,才,发,武,新,利,顺,信,子,杰,涛,昌,成,康,星,光,天,达,安,岩,中,茂,进,林,有,诚,先,敬,震,振,壮,会,思,群,豪,心,邦,承,乐,绍,功,松,善,厚,裕,河,哲,江,超,浩,亮,政,谦,亨,奇,固,之,轮,翰,朗,伯,宏,言,蕊,薇,菁,梦,岚,苑,婕,馨,瑗,琰,韵,融,园,艺,咏,卿,聪,澜,纯,爽,琬,茗,羽,希,宁,欣,飘,育,滢,馥,筠,柔,竹,霭,凝,晓,欢,霄,伊,亚,宜,可,姬,舒,影,荔,枝,思,丽,芬,芳,燕,莺,媛,艳,珊,莎,蓉,眉,君,琴,毓,悦,昭,冰,枫,芸,菲,寒,锦,玲,秋,秀,娟,英,华,慧,巧,美,娜,静,淑,惠,珠,翠,雅,芝,玉,萍,红,月,彩,春,菊,兰,凤,洁,梅,琳,素,云,莲,真,环,雪,荣,爱,妹,霞,香,瑞,凡,佳,嘉,琼,勤,珍,贞,莉,桂,娣,叶,璧,璐,娅,琦,晶,妍,茜,黛,青,倩,婷,姣,婉,娴,瑾,颖,露,瑶,怡,婵,雁,蓓,纨,仪,荷,丹".split(',')
        },
        en: {
            family: "Johnson,Williams,Brown,Jones,Miller,Davis,Garcia,Rodriguez,Wilson".split(','),
            name: "Jacob,Michael,Matthew,Joshua,Christopher,Nicholas,Andrew,Joseph,Daniel,Daniel,Tyler,Brandon,Ryan,Austin,William,John,David,Zachary,Anthony,James,Justin,Alexander,Jonathan,Dylan,Christian,Noah,Robert,Samuel,Kyle,Benjamin,Jose,Jordan,Kevin,Thomas,Nathan,Cameron,Hunter,Ethan,Aaron,Eric,Jason,Caleb,Logan,Brian,Luis,Adam,Juan,Steven,Jordan,Cody,Gabriel,Connor,Timothy,Charles,Isaiah,Jack,Carlos,Jared,Sean,Alex,Evan,Elijah,Richard,Patrick,Nathaniel,Isaac,Seth,Trevor,Angel,Luke,Devin,Bryan,Jesus,Mark,Ian,Mason,Cole,Adrian,Chase,Jeremy,Dakota,Garrett,Antonio,Jackson,Jesse,Blake,Dalton,Tanner,Stephen,Alejandro,Kenneth,Miguel,Victor,Lucas,Spencer,Bryce,Paul,Brendan,Jake,Tristan,Jeffrey,Leslie,Marcus,Emily,Hannah,Alexis,Samantha,Sarah,Ashley,Madison,Taylor,Jessica,Elizabeth,Alyssa,Lauren,Kayla,Brianna,Megan,Victoria,Emma,Abigail,Rachel,Olivia,Jennifer,Amanda,Nicole,Sydney,Morgan,Jasmine,Grace,Anna,Destiny,Julia,Alexandra,Haley,Natalie,Kaitlyn,Katherine,Stephanie,Brittany,Rebecca,Maria,Allison,Amber,Savannah,Danielle,Courtney,Mary,Gabrielle,Brooke,Sierra,Sara,Kimberly,Sophia,Mackenzie,Andrea,Michelle,Hailey,Vanessa,Katelyn,Katelyn,Erin,Isabella,Shelby,Jenna,Chloe,Melissa,Bailey,Makayla,Paige,Mariah,Kaylee,Kaylee,Madeline,Caroline,Kelsey,Kelsey,Marissa,Breanna,Kiara,Christina,Faith,Autumn,Laura,Tiffany,Jacqueline,Briana,Alexandria,Cheyenne,Mikayla,Cassandra,Claire,Alexa,Sabrina,Angela,Kathryn,Katie,Caitlin,Isabel,Miranda,Lindsey,Kelly,Catherine".split(',')
        }
    };
    var p;
    if (language === 'cn') {
        p = pool.cn;
    } else if (language === 'en') {
        p = pool.en;
    } else {
        p = Math.random() >= 0.5 ? pool.cn : pool.en;
    }
    return p.family[randBetween(0, p.family.length - 1)] + ' ' + p.name[randBetween(0, p.name.length - 1)] + p.name[randBetween(0, p.name.length - 1)];
    // return pool[randBetween(0, pool.length - 1)] + " " + pool[randBetween(0, pool.length - 1)];
}

function createJSON() {
    for (var i = 0; i < 10; i++) {
        var user = {};
        user.name = randName();
        user.avatar = 'img/' + (i + 1) + '.png';
        json.users.push(user);
    }
    for (var i = 0; i < 107; i++) {
        json.comments.push(randComment());
    }
}
