window.onload = function() {
    console.log('ready');
    var oInput = document.getElementById('input1');
    var oDiv = document.getElementById('div1');
    draw();
    console.log(randStr(20));

    function isHuiwen(str) {
        var revStr = str.split('').reverse().join('');
        return str === revStr;
    }
    oInput.addEventListener('input', function() {
        // console.log('input');
        // oDiv.innerHTML = isHuiwen(oInput.value);
        unitTest();
    }, false);

    function unitTest() {
        oDiv.innerHTML = findMostChar(oInput.value);
    }

    function removeRepeat(arr) {
        var dict = {};
        for (var i = 0, len = arr.length; i < len; i++) {
            dict[arr[i]] = 1;
        }
        var resArr = [];
        for (var item in dict) {
            resArr.push(item);
        }
        return resArr;
    }

    function findMostChar(str) {
        if (str.length <= 1) return str;
        var dict = {};
        var max = 1;
        var maxChar = str.charAt(0);
        for (var i = 1, len = str.length; i < len; i++) {
            var char = str.charAt(i);
            if (dict.hasOwnProperty(char)) {
                dict[char] += 1;
                if (dict[char] > max) {
                    max = dict[char];
                    maxChar = char;
                }
            } else {
                dict[char] = 1;
            }
        }
        return maxChar;
    }

    function swap(a, b) {
        a = a + b;
        b = a - b;
        a = a - b;
        return [a, b];
    }

    function draw() {
        var canvas = document.getElementById('my-canvas');
        var ctx = canvas.getContext('2d');
        // ctx.fillStyle = '#f60';
        ctx.beginPath();
        // ctx.strokeStyle = 'red';
        ctx.moveTo(250, 250);
        // ctx.arc(250, 250, 50, 0, 0.5 * Math.PI);
        ctx.arcTo(250, 250, 250 + 50, 250 - 50, 50);
        ctx.stroke();
    }

    function fabonacciArr(N) {
        var arr = [0, 1, 1];
        if (N <= 2) {
            return arr[N];
        }
        for (var i = 3; i < N; i++) {
            arr.push(arr[i - 1] + arr[i - 2]);
        }
        return arr;
        // return fabonacci[N - 1] + fabonacci[N - 2];
    }

    function findMaxDiff(arr) {
        return Math.max.apply(null, arr) - Math.min.apply(null, arr);
        // return Math.max(arr) - Math.min(arr);
    }

    function randStr(N) {
        if (typeof N === 'undefined' || N < 1) {
            N = 8;
        }
        var number = '0123456789';
        var alphabet = 'abcdefghijklmnopqrstuvwxyz';
        var alphabetUpper = alphabet.toUpperCase();
        var pool = number + alphabet + alphabetUpper;
        var len = pool.length;
        var res = [];
        for (var i = 0; i < N; i++) {
            var index = Math.floor(Math.random() * len);
            res.push(pool.charAt(index));
        }
        return res.join('');
    }

    function getByClassname(parent, classname) {
        var resArr = [];
        var allElements = parent.getElementsByTagName('*');
        var reg = new RegExp('^|\b' + classname + '\b|$');
        for (var i = 0, len = allElements.length; i < len; i++) {
            if (reg.test(allElements[i].classname)) {
                resArr.push(allElements[i]);
            }
        }
        return resArr;
    }

    function myReplace(str, before, after) {
        // var upperAlpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var first = before.charAt(0)
        if (before.charAt(0) === before.charAt(0).toUpperCase()) {
            // if (upperAlpha.indexOf(before.charAt(0)) !== -1) {
            after = after.charAt(0).toUpperCase() + after.slice(1);
        }
        str = str.replace(before, after);
        console.log(str);
        return str;
    }
    myReplace("A quick brown fox Jumped over the lazy dog", "Jumped", "leaped");

    function translate(str) {
        // var reg = /[aeiou]/i;
        var firstYuanIndex = str.search(/[aeiou]/i);
        console.log(firstYuanIndex);
        if (firstYuanIndex === 0) {
            //首字母是元音字母
            str += 'way';
        } else {
            str = str.slice(firstYuanIndex) + str.slice(0, firstYuanIndex) + 'ay';
        }
        console.log(str);
        return str;
    }
    translate("california")
};
