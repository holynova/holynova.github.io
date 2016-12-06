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

    function str2fixed(str, N) {
        var len = str.length;
        if (len >= N) {
            return str;
        } else {
            for (var i = 0; i < N - len; i++) {
                str = ' ' + str;
            }
            return str;
        }
    }
    result.averageTime = totalTime / options.sampleSize;
    console.log('%s: √:%d, x:%d, avg-time:%d ms',
        str2fixed(func.name, 20), result.right, result.wrong, result.averageTime.toFixed(3));
}

function quickSort(arr) {
    function swap(arr, i, j) {
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    function shuffle(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            var index = Math.floor(Math.random() * i);
            swap(arr, i, index);
        }
    }

    function compare(a, b) {
        return a - b;
    }

    function partition(arr, lo, hi) {
        var pivot = arr[hi];
        var keyIndex = lo;
        for (var i = lo; i < hi; i++) {
            if (compare(arr[i], pivot) < 0) {
                swap(arr, i, keyIndex);
                keyIndex++;
            }
        }
        swap(arr, keyIndex, hi);
        return keyIndex;
    }

    function sort(arr, lo, hi) {
        if (lo >= hi) return;
        var keyIndex = partition(arr, lo, hi);
        sort(arr, lo, keyIndex - 1);
        sort(arr, keyIndex + 1, hi);
    }
    shuffle(arr);
    sort(arr, 0, arr.length - 1);
    return arr;
}

function mergeSort(arr) {
    function compare(a, b) {
        return a - b;
    }
    var shadowArr = new Array(arr.length);

    function merge(arr, lo, mid, hi) {
        var leftP = lo;
        var rightP = mid + 1;
        for (var i = lo; i <= hi; i++) {
            shadowArr[i] = arr[i];
        }
        for (var i = lo; i <= hi; i++) {
            if (leftP > mid) arr[i] = shadowArr[rightP++];
            else if (rightP > hi) arr[i] = shadowArr[leftP++];
            else if (compare(shadowArr[leftP], shadowArr[rightP]) < 0) arr[i] = shadowArr[leftP++];
            else arr[i] = shadowArr[rightP++];
        }
    }

    function sort(arr, lo, hi) {
        if (lo >= hi) return;
        var mid = Math.floor((lo + hi) / 2);
        sort(arr, lo, mid);
        sort(arr, mid + 1, hi);
        merge(arr, lo, mid, hi);
    }
    sort(arr, 0, arr.length - 1);
    return arr;
}

function heapSort(arr) {
    //make a heap
    //find the max num(heap top)
    //swap the heap top and the last item of the array
    //sink
    //loop
    // console.log(arr);
    arr.unshift('-');

    function compare(a, b) {
        return a - b;
    }

    function swap(arr, i, j) {
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    function makeHeap() {
        var startIndex = Math.floor(arr.length - 1);
        for (var i = startIndex; i >= 1; i--) {
            sink(arr, i, arr.length - 1);
        }
    }
    // function sink(arr, index, hi) {
    //     while (2 * index <= hi) {
    //         var maxSonIndex = 2 * index;
    //         if (hi > maxSonIndex && compare(arr[maxSonIndex + 1], arr[maxSonIndex]) > 0) {
    //             maxSonIndex++;
    //         }
    //         if (compare(arr[index], arr[maxSonIndex]) > 0) {
    //             break;
    //         } else {
    //             swap(arr, index, maxSonIndex);
    //             index = maxSonIndex;
    //         }
    //     }
    // }
    function sink(arr, index, hi) {
        while (index * 2 <= hi) {
            var maxSonIndex = index * 2;
            if (maxSonIndex < hi && compare(arr[maxSonIndex], arr[maxSonIndex + 1]) < 0) {
                maxSonIndex++;
            }
            if (compare(arr[index], arr[maxSonIndex]) < 0) {
                swap(arr, index, maxSonIndex);
                index = maxSonIndex;
            } else {
                break;
            }
        }
    }

    function sort() {
        for (var i = arr.length - 1; i > 1; i--) {
            swap(arr, 1, i);
            sink(arr, 1, i - 1);
        }
    }
    makeHeap();
    sort();
    arr.shift();
    // console.log(arr);
    return arr;
}

function bubbleSort(arr) {
    function compare(a, b) {
        return a - b;
    }

    function swap(arr, i, j) {
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    // 从前往后，每次冒出来一个最大值
    function sort(arr) {
        for (var i = 0; i < arr.length - 1; i++) {
            var isSwap = false;
            for (var j = 0; j < arr.length - 1 - i; j++) {
                if (compare(arr[j], arr[j + 1]) > 0) {
                    swap(arr, j, j + 1);
                    isSwap = true;
                }
            }
            if (!isSwap) {
                break;
            }
        }
    }
    //  从后往前，每次冒出来一个最小的
    // function sort(arr) {
    //     var len = arr.length;
    //     for (var i = len - 1; i >= 1; i--) {
    //         var isSwap = false;
    //         for (var j = len - 1; j >= 1; j--) {
    //             if (compare(arr[j], arr[j - 1]) < 0) {
    //                 swap(arr, j, j - 1);
    //                 isSwap = true;
    //             }
    //         }
    //         if (!isSwap) {
    //             break;
    //         }
    //     }
    // }
    sort(arr);
    return arr;
}

function insertSort(arr) {
    function compare(a, b) {
        return a - b;
    }

    function swap(arr, i, j) {
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    function sort(arr) {
        var len = arr.length;
        for (var i = 1; i < len; i++) {
            var curCnt = i;
            while (curCnt - 1 >= 0) {
                if (compare(arr[curCnt - 1], arr[curCnt]) > 0) {
                    swap(arr, curCnt, curCnt - 1);
                    curCnt--;
                } else {
                    break;
                }
            }
        }
    }
    sort(arr);
    return arr;
}
//================================================================
var options = {
    sampleSize: 99999,
    arrSize: 10,
    arrMin: 0,
    arrMax: 40
}
testSort(quickSort, options);
testSort(mergeSort, options);
testSort(heapSort, options);
testSort(insertSort, options);
testSort(bubbleSort, options);
