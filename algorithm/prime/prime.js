(function() {
    console.log('ready');

    function testFuncTime(func, args, showResult) {
        var start = new Date();
        var res = func.apply(null, args);
        var time = Date.now() - start;
        console.log(func.name + ':' + time + 'ms');
        if (showResult) {
            console.log(res);
        }
    }

    function findPrime(N) {
        if (typeof N === 'undefined') {
            N = 100;
        } else {
            if (N <= 0) return;
        }
        var i = 2,
            cnt = 0,
            resArr = [];
        while (true) {
            var isPrime = true;
            for (var j = 2; j < i / 2; j++) {
                if (i % j === 0) {
                    isPrime = false;
                    break;
                }
            }
            if (isPrime) {
                resArr.push(i);
                cnt++;
                if (cnt === N) {
                    return resArr;
                }
            }
            i++;
        }
    }

    function findPrime2(N) {
        if (typeof N === 'undefined') {
            N = 100;
        } else {
            if (N <= 0) return;
        }
        var i = 2,
            cnt = 0,
            resArr = [];
        while (true) {
            var isPrime = true;
            for (var j = 2; j <= Math.sqrt(i); j++) {
                if (i % j === 0) {
                    isPrime = false;
                    break;
                }
            }
            if (isPrime) {
                resArr.push(i);
                cnt++;
                if (cnt === N) {
                    return resArr;
                }
            }
            i++;
        }
    }
    //用当前值i,除以比sqrt(i)小的质数,看能否整除
    function findPrime3(N) {
        if (typeof N === 'undefined') {
            N = 100;
        } else {
            if (N <= 0) return;
        }
        var i = 2,
            cnt = 0,
            resArr = [];
        while (true) {
            var isPrime = true;
            for (var j = 0, len = resArr.length; j < len; j++) {
                if (resArr[j] > Math.sqrt(i)) {
                    break;
                }
                if (i % resArr[j] === 0) {
                    isPrime = false;
                    break;
                }
            }
            if (isPrime) {
                resArr.push(i);
                cnt++;
                if (cnt === N) {
                    return resArr;
                }
            }
            i++;
        }
    }
    //用筛法找,
    function findPrime4(N) {
        // y = x/ln(x)
        if (typeof N === 'undefined') {
            N = 10000;
        }
        if (N <= 3) return;
        var arr = new Array(N);
        arr.fill(true);
        var resArr = [];
        for (var i = 2, len = arr.length; i < len; i++) {
            //倍数计数器
            if (arr[i]) {
                resArr.push(i);
                var cnt = 2 * i;
                while (cnt < N) {
                    arr[cnt] = false;
                    cnt += i;
                }
                // var multipleCnt = 2;
                // while (i * multipleCnt < N) {
                //     arr[i * multipleCnt] = false;
                //     multipleCnt++;
                // }
            }
        }
        return resArr;
    }
    // testFuncTime(findPrime, [10000], true);
    testFuncTime(findPrime2, [664579], true);
    testFuncTime(findPrime3, [664579], true);
    testFuncTime(findPrime4, [1e7], true);
    // var resArr = findPrime4();
    // console.log(resArr.length);
    // console.log(findPrime4());
    //求[0,N]区间内的约有多少个素数
    function findPrimeQty(N) {
        var qty = N / Math.log(N);
        console.log(qty);
        return (qty);
    }
    findPrimeQty(2000000);
})();
