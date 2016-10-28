window.onload = function() {
    test();

    function test() {
        // print(arrDiff(["andesite", "grass", "dirt", "dead shrub"], ["andesite", "grass", "dirt", "dead shrub"]));
        // print(arrDiff(["andesite", "grass", "dirt", "dead shrub"], ["andesite", "grass", "dirt", "dead shrub"]));
        print(num2str(1234567890));
        print(num2str(11010000));
        print(num2str(10000000));
        print(num2str(10010101));
        var num = 1;
        for (var i = 0; i < 15; i++) {
            print(num2str(num));
            num *= 10;
        }
    }

    function num2str(num, lang) {
        if (typeof lang == 'undefined') {
            lang = 'chinese';
        }
        var charArr = {
                cn: '零一二三四五六七八九'.split(''),
                cnBig: '零壹贰叁肆伍陆柒捌玖'.split(''),
                en: 'zero,one,two,three,four,five,six,seven,eight,nine'.split(',')
            },
            upArr = {
                cn: ['', '十', '百', '千'],
                cn2: ['', '万', '亿', 'X']
            };
        console.log(charArr);
        var numArr = ('' + num).split('').reverse();
        // numStr.reverse();
        var res = [];
        if (lang === 'chinese') {
            // var zeroCnt = 0;
            for (var i = 0; i < numArr.length; i++) {
                // var bit = parseInt(numStr.charAt(i));
                // if (cnt % 4 !== 0) {
                //     res.unshift(upArr.cn[cnt % 4]);
                // } else {
                //     cnt = Math.min(cnt, 12);
                //     res.unshift(upArr.cn2[Math.floor(cnt / 4)]);
                // }
                // res.unshift(charArr.cn[bit]);
                var bit = parseInt(numArr[i]);
                if (i % 4 === 0) {
                    res.unshift(upArr.cn2[Math.min(Math.floor(i / 4), 3)]);
                    if (bit !== 0) {
                        res.unshift(charArr.cn[bit]);
                    }
                    // else {
                    //     res.unshift('Z');
                    // }
                } else {
                    if (bit !== 0) {
                        res.unshift(upArr.cn[i % 4]);
                    }
                    res.unshift(charArr.cn[bit]);
                }
            }
            return res.join('').replace(/零{2,}/g, '零').replace(/零$/g, '');
            // .replace(/零[亿万]/g, '');
            return res.join('');
        }
    }

    function segment2str(num) {
        var str = '',
            preZero = false;
        while (num) {
            var bit = num % 10;
            if (bit === 0) {}
            num = Math.floor(num / 10);
        }
        return str;
    }

    function arrDiff(arr1, arr2) {
        var res1 = arr1.filter(function(a) {
            return arr2.indexOf(a) == -1;
        });
        var res2 = arr2.filter(function(a) {
            return arr1.indexOf(a) == -1;
        });
        return res1.concat(res2);
    }

    function print(str) {
        console.log(str);
        document.write(str + '<br>');
        // console.log
    }
};
