window.onload = function() {
    test();

    function test() {
        // print(arrDiff(["andesite", "grass", "dirt", "dead shrub"], ["andesite", "grass", "dirt", "dead shrub"]));
        print(arrDiff(["andesite", "grass", "dirt", "dead shrub"], ["andesite", "grass", "dirt", "dead shrub"]));
    }

    function num2str(lang, num) {
        if (typeof lang == 'undefined') {
            lang = 'chinese';
        }
        var charArr = {
            cn: '零一二三四五六七八九十'.split(''),
            cnBig: '零壹贰叁肆伍陆柒捌'.split(''),
            en: 'zero,one,two,three,four,five,six,seven,eight,nine'.split(',')
        }
        num = '' + num;
        // num.reverse();

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
        document.write(str);
        // console.log
    }

};
