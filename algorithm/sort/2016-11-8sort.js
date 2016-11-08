//options = {sampleSize, arrSize, arrMin, arrMax}
function testSort(func, options) {
    options = options || {
        sampleSize: 100,
        arrSize: 1000,
        arrMin: -1000,
        arrMax: 1000
    };
    if (typeof options.sampleSize === 'undefined') options.sampleSize = 100;
    if (typeof options.arrSize === 'undefined') options.arrSize = 1000;
    if (typeof options.arrMin === 'undefined') options.arrMin = -1000;
    if (typeof options.arrMax === 'undefined') options.arrMax = 1000;
    //生成数组
    function genArr(arrSize, arrMin, arrMax) {
        if (typeof arrSize === 'undefined') arrSize = 1000;
        if (typeof arrMin === 'undefined') arrMin = -1000;
        if (typeof arrMax === 'undefined') arrMax = 1000;
        var arr = new Array(arrSize);
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arrMin + Math.floor(Math.random() * (arrMax - arrMin));
        }
        return arr;
    }
    // options = options || {}
    function isArrEqual(arr1, arr2) {
        return JSON.stringify(arr1) == JSON.stringify(arr2);
    }

    function testFunc(func) {
        var arr = genArr(options.arrSize, options.arrMin, options.arrMax);
        var arrClone = arr.slice();
        var startTime = Date.now();
        func(arr);
        var time = Date.now() - startTime;
        // console.log('%s finished in %d ms', func.name, time);
        arrClone.sort(function(a, b) {
            return a - b;
        });
        return {
            isRight: isArrEqual(arr, arrClone),
            time: time
        }
    }
    var result = {
        right: 0,
        wrong: 0,
        averageTime: -1
    }
    var totalTime = 0;
    for (var i = 0; i < options.sampleSize; i++) {
        var testResult = testFunc(func);
        totalTime += testResult.time;
        if (testResult.isRight) {
            result.right++;
        } else {
            result.wrong++;
        }
    }
    result.averageTime = totalTime / options.sampleSize;
    console.log('%s tested:right %d, wrong %d , averageTime:%d ms', func.name, result.right, result.wrong, result.averageTime);
}
// -----------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------
function quickSort(arr) {
    function swap(i, j) {
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    function shuffle() {
        for (var i = arr.length - 1; i > 0; i--) {
            swap(i, Math.floor(Math.random() * i));
        }
        return arr;
    }

    function partition(lo, hi) {
        var pivot = arr[hi];
        var keyIndex = lo;
        for (var i = lo; i < hi; i++) {
            if (arr[i] < pivot) {
                swap(keyIndex, i);
                keyIndex++;
            }
        }
        swap(keyIndex, hi);
        return keyIndex;
    }

    function sort(lo, hi) {
        if (lo >= hi) return;
        var keyIndex = partition(lo, hi);
        sort(lo, keyIndex - 1);
        sort(keyIndex + 1, hi);
    }
    shuffle();
    sort(0, arr.length - 1);
    return arr;
}

function mergeSort(arr) {
    var shadowArr = new Array(arr.length);

    function merge(lo, mid, hi) {
        for (var i = lo; i < hi + 1; i++) {
            shadowArr[i] = arr[i];
        }
        var leftP = lo;
        var rightP = mid + 1
        for (var i = lo; i < hi + 1; i++) {
            if (leftP > mid) arr[i] = shadowArr[rightP++];
            else if (rightP > hi) arr[i] = shadowArr[leftP++];
            else if (shadowArr[leftP] > shadowArr[rightP]) arr[i] = shadowArr[rightP++];
            else arr[i] = shadowArr[leftP++];
        }
    }

    function sort(lo, hi) {
        if (lo >= hi) return;
        var mid = Math.floor((lo + hi) / 2);
        sort(lo, mid);
        sort(mid + 1, hi);
        merge(lo, mid, hi);
    }
    sort(0, arr.length - 1);
    return arr;
}
// -----------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------
function heapSort(arr) {
    arr.unshift('-');

    function swap(i, j) {
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    function sink(index, hi) {
        while (index * 2 <= hi) {
            var maxSonIndex = index * 2;
            if (maxSonIndex < hi) {
                if (arr[maxSonIndex + 1] > arr[maxSonIndex]) {
                    maxSonIndex++;
                }
            }
            if (arr[index] < arr[maxSonIndex]) {
                swap(index, maxSonIndex);
                index = maxSonIndex;
            } else {
                break;
            }
        }
    }

    function makeHeap() {
        var key = Math.floor((arr.length - 1) / 2);
        for (var i = key; i >= 1; i--) {
            sink(i, arr.length - 1);
        }
    }
    makeHeap();
    for (var i = arr.length - 1; i > 1; i--) {
        swap(1, i);
        sink(1, i - 1);
    }
    arr.shift();
    return arr;
}
// -----------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------
var options = {
    sampleSize: 100,
    arrSize: 99999,
    arrMin: -9999,
    arrMax: 9999
}
testSort(heapSort, options);
testSort(quickSort, options);
testSort(mergeSort, options);
