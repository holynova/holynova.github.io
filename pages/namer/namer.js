$(function() {
    console.log('ready');
    $('#btn-go').on('click', function() {
            refreshName(10)
        })
        // refreshName(3);
    function refreshName(num) {
        var jsonFilename = $('select').val();
        $.ajax({
            url: jsonFilename,
            dataType: 'json',
            success: function(dataArr) {
                var html = '';
                for (var i = 0; i < num; i++) {
                    var name = genName(dataArr);
                    html += name2html(name);
                }
                $('ul').html(html);
            }
        })
    }

    function name2html(nameObj) {
        var familyName = $('input[type=text]').val();
        nameObj['familyName'] = familyName;
        var template = "<li class='name-box'><h3>{{familyName}}{{name}}</h3><p class='sentence'><span>「</span>{{sentence}}<span>」</span></p><p class = 'book'>----{{book}} <<{{title}}>></p><p class = 'author'>[{{dynasty}}]{{author}}</p></li>";
        return getHtmlFromTemplate(template, nameObj);
        // return '<li class="name-box"><h3>' +
        //     familyName + nameObj.name +
        //     '</h3>' + '<p><span>『</span>' +
        //     nameObj.sentence +
        //     '<span>』</span></p>' + '<p>' + nameObj.book + '•' +
        //     nameObj.title + '</p><p>[' + nameObj.dynasty + '] ' + nameObj.author + '</p> </li>'
    }

    function getHtmlFromTemplate(template, dataJson) {
        var html = template;
        for (var key in dataJson) {
            var reg = new RegExp('{{' + key + '}}', 'g');
            html = html.replace(reg, dataJson[key]);
        }
        return html;
    }

    function genRandPoem(dataArr) {
        var index = randBetween(0, dataArr.length);
        while (!dataArr[index].content) {
            index = randBetween(0, dataArr.length);
        }
        return dataArr[index];
    }

    function randBetween(min, max) {
        //[min,max)  max is not included
        return min + Math.floor(Math.random() * (max - min));
    }

    function splitSentence(str) {
        str = cleanStr(str);
        str = str.replace(/！|。|？|；/g, function(str) {
            return str + '|';
        })
        str = str.replace(/\|$/g, '');
        var arr = str.split('|');
        arr = arr.filter(function(item) {
            return item.length >= 2;
        })
        return arr;
    }

    function cleanStr(str) {
        str = str.replace(/\s|<br>|<p>|<\/p>|　|”|“/g, '');
        str = str.replace(/\(.+\)/g, '');
        return str
    }

    function randCharFromStr(str, num, ordered) {
        if (typeof ordered === 'undefined') {
            ordered = true;
        }
        var randNumArr = genRandNumArr(str.length, num);
        if (ordered) {
            randNumArr = randNumArr.sort(function(a, b) {
                return a - b;
            });
        }
        var res = '';
        for (var i = 0; i < randNumArr.length; i++) {
            res += str.charAt(randNumArr[i]);
        }
        return res;
    }

    function genRandNumArr(max, num) {
        if (num > max) {
            num = max;
            console.log('max=' + max + ' num = ' + num);
            // throw new Error('too large num');
        }
        var orderedNum = [];
        for (var i = 0; i < max; i++) {
            orderedNum.push(i);
        }
        var res = [];
        for (var i = 0; i < num; i++) {
            var randIndex = randBetween(0, orderedNum.length);
            var randNum = orderedNum[randIndex];
            res.push(randNum);
            orderedNum.splice(randIndex, 1);
            // console.log('i=' + i + 'rand=' + rand, orderedNum);
        }
        return res;
    }

    function genName(dataArr) {
        var randPoem = genRandPoem(dataArr);
        var sentences = splitSentence(randPoem.content);
        var randSentence = sentences[randBetween(0, sentences.length)];
        var name = {};
        name.title = randPoem.title;
        name.book = randPoem.book;
        name.sentence = randSentence;
        name.content = randPoem.content;
        name.author = randPoem.author;
        name.dynasty = randPoem.dynasty;
        var cleanSentence = cleanPunctuation(randSentence);
        name.name = randCharFromStr(cleanSentence, 2);
        return name
    }
    //清除标点符号
    function cleanPunctuation(str) {
        var puncReg = /[<>《》！*\(\^\)\$%~!@#…&%￥—\+=、。，？；‘’“”：·`]/g;
        return str.replace(puncReg, '');
    }
});
