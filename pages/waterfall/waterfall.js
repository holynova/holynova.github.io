// EventUtil.addEvent(document.window, 'load', windowLoadHandler);
window.onload = windowLoadHandler;

function windowLoadHandler() {
    var oWrapper = document.querySelector('.wrapper');
    var oMask = document.querySelector('.mask');
    var data = []; //存储所有picbox数据的全局变量
    var cntPic = 0; //全局计数器
    for (var i = 1; i <= 97; i++) {
        data.push(new PicBox(picSrc = 'img/' + i + '.jpg'));
    }

    for (var j = 0; j < 10; j++) {
        loadImgs();
    }
    while (positionToViewPort(oWrapper, 0).bottom == 0) {
        loadImgs();
    }
    EventUtil.addEvent(window, 'scroll', loadImgs);
    EventUtil.addEvent(window, 'resize', loadImgs);
    EventUtil.addEvent(oWrapper, 'click', wrapperClickHandler);
    EventUtil.addEvent(oMask, 'click', hideMask);

    function loadImgs() {
        var oUls = document.querySelectorAll('.wrapper ul');
        for (var i = 0; i < oUls.length; i++) {
            //此处偏移500像素,提前500像素加载
            if (positionToViewPort(oUls[i], -500).bottom <= 0) {
                data[cntPic].appendTo(oUls[i]);
                cntPic = (cntPic + 1) % data.length;
            }
        }
    }
};
//
function wrapperClickHandler(event) {
    event = event || window.event;
    var tar = event.target || event.srcElement;
    var oMask = document.querySelector('.mask');
    if (tar.parentNode.className == 'pic_box') {
        oMask.style.display = 'block';
        var parent = tar.parentNode;
        oMask.querySelector('img').src = parent.querySelector('img').src;
        oMask.querySelector('h1').innerHTML = parent.querySelector('h3').innerHTML;
        oMask.querySelector('p').innerHTML = parent.querySelector('p').innerHTML;
    }
}

function hideMask() {
    var oMask = document.querySelector('.mask');
    oMask.style.display = "none";
}
// 找到目前最短的Ul,在后面加入一个图片box
function addOnePic(picBox) {
    var shortestUl = getShortestUl();
    picBox.appendTo(shortestUl);
}

function getShortestUl() {
    var oUl = document.querySelectorAll('.wrapper .pics ul');
    var aUl = [];
    for (var i = 0; i < oUl.length; i++) {
        aUl.push(oUl[i]);
    }
    aUl.sort(function(a, b) {
        return a.offsetHeight - b.offsetHeight;
    })
    return aUl[0];
}
//判断一个元素的顶部和底部在不在视口范围内
//参数 offset相对于原位置的偏移,可以为负数
//返回一个对象,有.top .bottom两个属性,分别代表上沿和下沿的位置
//返回值代表的位置, -1:above, 0:in ,1:under
function positionToViewPort(elem, offset) {
    var browserHeight = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight;
    var elemHeight = elem.offsetHeight;
    var rect = elem.getBoundingClientRect();
    var dic = {};
    if (offset == undefined) {
        offset = 0;
    }
    if (rect.top + offset < 0) {
        dic.top = -1;
    } else if (rect.top + offset < browserHeight) {
        dic.top = 0;
    } else if (rect.top + offset >= browserHeight) {
        dic.top = 1;
    }
    if (rect.top + offset + elemHeight < 0) {
        dic.bottom = -1;
    } else if (rect.top + offset + elemHeight < browserHeight) {
        dic.bottom = 0;
    } else if (rect.top + offset + elemHeight >= browserHeight) {
        dic.bottom = 1;
    }
    return dic;
}

function PicBox(picSrc, title, author, detailStr) {
    PicBox.prototype.titles = '寒蝉凄切,对长亭晚,骤雨初歇,都门帐饮无绪,留恋处,兰舟催发,执手相看泪眼,竟无语凝噎,念去去,千里烟波,暮霭沉沉楚天阔,多情自古伤离别,更那堪,冷落清秋节,今宵酒醒何处,杨柳岸,晓风残月,此去经年,应是良辰好景虚设,便纵有千种风情,更与何人说'.split(',');
    PicBox.prototype.details = '汉皇重色思倾国,御宇多年求不得,杨家有女初长成,养在深闺人未识,天生丽质难自弃,一朝选在君王侧,回眸一笑百媚生,六宫粉黛无颜色,春寒赐浴华清池,温泉水滑洗凝脂,侍儿扶起娇无力,始是新承恩泽时,云鬓花颜金步摇,芙蓉帐暖度春宵,春宵苦短日高起,从此君王不早朝,承欢侍宴无闲暇,春从春游夜专夜,后宫佳丽三千人,三千宠爱在一身,金屋妆成娇侍夜,玉楼宴罢醉和春,姊妹弟兄皆列土,可怜光彩生门户,遂令天下父母心,不重生男重生女,骊宫高处入青云,仙乐风飘处处闻,缓歌慢舞凝丝竹,尽日君王看不足,渔阳鼙鼓动地来,惊破霓裳羽衣曲,九重城阙烟尘生,千乘万骑西南行,翠华摇摇行复止,西出都门百余里,六军不发无奈何,宛转蛾眉马前死,花钿委地无人收,翠翘金雀玉搔头,君王掩面救不得,回看血泪相和流,黄埃散漫风萧索,云栈萦纡登剑阁,峨嵋山下少人行,旌旗无光日色薄,蜀江水碧蜀山青,圣主朝朝暮暮情,行宫见月伤心色,夜雨闻铃肠断声,天旋地转回龙驭,到此踌躇不能去,马嵬坡下泥土中,不见玉颜空死处,君臣相顾尽沾衣,东望都门信马归,归来池苑皆依旧,太液芙蓉未央柳,芙蓉如面柳如眉,对此如何不泪垂,春风桃李花开日,秋雨梧桐叶落时,西宫南内多秋草,落叶满阶红不扫,梨园弟子白发新,椒房阿监青娥老,夕殿萤飞思悄然,孤灯挑尽未成眠,迟迟钟鼓初长夜,耿耿星河欲曙天,鸳鸯瓦冷霜华重,翡翠衾寒谁与共,悠悠生死别经年,魂魄不曾来入梦,临邛道士鸿都客,能以精诚致魂魄,为感君王辗转思,遂教方士殷勤觅,排空驭气奔如电,升天入地求之遍,上穷碧落下黄泉,两处茫茫皆不见,忽闻海上有仙山,山在虚无缥渺间,楼阁玲珑五云起,其中绰约多仙子,中有一人字太真,雪肤花貌参差是,金阙西厢叩玉扃,转教小玉报双成,闻道汉家天子使,九华帐里梦魂惊,揽衣推枕起徘徊,珠箔银屏迤逦开,云鬓半偏新睡觉,花冠不整下堂来,风吹仙袂飘飘举,犹似霓裳羽衣舞,玉容寂寞泪阑干,梨花一枝春带雨,含情凝睇谢君王,一别音容两渺茫,昭阳殿里恩爱绝,蓬莱宫中日月长,回头下望人寰处,不见长安见尘雾,惟将旧物表深情,钿合金钗寄将去,钗留一股合一扇,钗擘黄金合分钿,但教心似金钿坚,天上人间会相见,临别殷勤重寄词,词中有誓两心知,七月七日长生殿,夜半无人私语时,在天愿作比翼鸟,在地愿为连理枝,天长地久有时尽,此恨绵绵无绝期'.split(',');
    PicBox.prototype.authors = '温庭筠,韦庄,冯延巳,李璟,李煜,晏殊,欧阳修,柳永,晏几道,苏轼,秦观,周邦彦,陆游,辛弃疾,吴文英'.split(',');
    PicBox.prototype.toHTML = function() {
        return '<img src="' + this.picSrc + '" alt="' + this.title + '">' + '<h3>' + this.title + '</h3>' + '<span>' + this.author + '</span>' + '<p>' + this.detailStr + '</p>';
    };
    PicBox.prototype.randChoose = function(arr) {
        return arr[PicBox.prototype.randBetween(0, arr.length - 1)];
    };
    PicBox.prototype.randBetween = function(min, max) {
        return min + parseInt(Math.random() * (max - min));
    };
    PicBox.prototype.appendTo = function(parent) {
        var oLi = document.createElement('li');
        oLi.innerHTML = this.toHTML();
        oLi.className = 'pic_box';
        parent.appendChild(oLi);
    };
    this.id = new Date().getTime() + 0;
    this.picSrc = picSrc;
    this.title = title || PicBox.prototype.randChoose(PicBox.prototype.titles);
    this.author = author || PicBox.prototype.randChoose(PicBox.prototype.authors);
    this.detailStr = detailStr || PicBox.prototype.randChoose(PicBox.prototype.details) + ',' + PicBox.prototype.randChoose(PicBox.prototype.details);
}
var EventUtil = {
    'addEvent': function(elem, event, func) {
        return elem.attachEvent ? elem.attachEvent('on' + event, func) : elem.addEventListener(event, func, false);
    }
};
