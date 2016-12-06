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
//2016年11月7日 每日练习
function quickSort(arr) {
    function swap(arr, i, j) {
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    function shuffle(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            swap(arr, i, Math.floor(Math.random() * i));
        }
        return arr
    }

    function partition(arr, lo, hi) {
        var pivot = arr[hi];
        var keyIndex = lo;
        for (var i = lo; i < hi; i++) {
            if (arr[i] < pivot) {
                swap(arr, i, keyIndex);
                keyIndex++;
            }
        }
        swap(arr, keyIndex, hi);
        return keyIndex;
    }

    function sort(arr, lo, hi) {
        if (lo >= hi) {
            return;
        }
        var keyIndex = partition(arr, lo, hi);
        sort(arr, lo, keyIndex - 1);
        sort(arr, keyIndex + 1, hi);
    }
    shuffle(arr);
    sort(arr, 0, arr.length - 1)
        // console.log(arr.join(','))
    return arr;
}

function mergeSort(arr) {
    var shadowArr = new Array(arr.length);

    function merge(arr, lo, mid, hi) {
        for (var i = lo; i < hi + 1; i++) {
            shadowArr[i] = arr[i];
        }
        var leftP = lo;
        var rightP = mid + 1;
        for (var i = lo; i < hi + 1; i++) {
            if (leftP > mid) {
                arr[i] = shadowArr[rightP];
                rightP++;
            } else if (rightP > hi) {
                arr[i] = shadowArr[leftP];
                leftP++;
            } else if (shadowArr[rightP] < shadowArr[leftP]) {
                arr[i] = shadowArr[rightP];
                rightP++;
            } else {
                arr[i] = shadowArr[leftP];
                leftP++;
            }
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
    // console.log(arr.join(','));
    return arr;
}

function heapSort(arr) {

    //在头部添加一个没用的值,使得节点i的两个子节点恰好是2i和2i+1
    arr.unshift('-');

    function swap(arr, i, j) {
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    function sink(arr, index, maxIndex) {
        //原理:在二叉树中,index节点的下面有2个子节点, 分别是index*2 和 index*2+1, 若index节点比子节点中的最大者小,则下沉一层(交换index节点和最大的子节点)
        //
        /*while的判断条件中: index * 2 <= maxIndex ,相等时,表示index*2正好是最后一个节点,此时index节点这棵树下面只有一个分支,此时两个分支中的最大者就是这个分支,就是index*2 */
        while (index * 2 <= maxIndex) {
            maxSonIndex = index * 2;
            //if 判断中没有 maxSonIndex 即index*2正好等于maxIndex的情况,因为此时要把maxSonIndex做加一处理
            //若maxSonIndex == maxIndex, 则最大子节点一定是 index*2因此不用加1
            if (maxSonIndex < maxIndex && arr[maxSonIndex] < arr[maxSonIndex + 1]) {
                maxSonIndex++;
            }
            if (arr[maxSonIndex] > arr[index]) {
                //最大子节点的值大于index节点,有几种情况
                //A:两个子节点都比index节点大,则交换index和最大的
                //B:两个子节点中较大者,比index大,另一个比index小, 则还是交换index和最大子节点
                swap(arr, maxSonIndex, index);
                index = maxSonIndex;
            } else {
                //两个子节点中最大的都小于等于index节点,那么另一个更小的一定也小于, 此时index下沉到了合适的位置,停止while循环
                break;
            }
        }
    }

    function makeHeap(arr) {
        //构造一个堆, 是要从下往上,每一个节点都sink到合适的位置
        //因为最底下一层没有办法再下沉了, 故从有子节点的倒数第二层开始,符合这样条件的第一个节点正好是(length-1)/2这个位置的,注意,现在的length是添加了一个辅助数字之后的,比实际的数组多1
        var mid = Math.floor((arr.length - 1) / 2);
        for (var i = mid; i >= 1; i--) {
            sink(arr, i, arr.length - 1);
        }
        return arr;
    }
    makeHeap(arr);
    //排序原理, 每次吧最大的节点(堆顶),弄到最后面去, 把最后一个还没完成排序的子节点换上来, 然后这个子节点sink到正确的位置, 又重新构成了一个堆, 新的堆顶此次是又是当前的最大值
    for (var i = arr.length - 1; i > 1; i--) {
        swap(arr, 1, i);
        sink(arr, 1, i - 1);
    }
    arr.shift();
    // console.log(arr.join(','))
    return arr;
}

function bubbleSort(arr) {
    function swap(arr, i, j) {
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    function sort(arr) {
        var len = arr.length
        var lastSwapIndex = len - 1;
        for (var i = 0; i < len; i++) {
            var curSwapIndex = -1;
            var isSwap = false;
            for (var j = 0; j < lastSwapIndex; j++) {
                //最大的往后挪
                if (arr[j] > arr[j + 1]) {
                    swap(arr, j, j + 1);
                    isSwap = true;
                    curSwapIndex = j;
                    //记下当前交换的索引, 如果这轮交换完成, 这个数字就等于最后一次交换的位置,最后一次交换后面的数字就都是排好序的了.下一轮就不用再比较这往后的数字了, 因为都已经有序
                }
            }
            if (!isSwap) {
                //如果这一轮没有交换,证明已经排序完成了
                break;
            }
            lastSwapIndex = curSwapIndex;
        }
    }
    sort(arr);
    return arr;
}
//鸡尾酒排序 是冒泡排序的一种改进
//
function cocktailSort(arr) {
    function swap(arr, i, j) {
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    function sort1(arr) {
        var len = arr.length
        for (var i = 0; i < len; i++) {
            // var curSwapIndex = -1;
            var isSwap = false;
            for (var j = i; j <= len - i - 2; j++) {
                //最大的往后挪
                if (arr[j] > arr[j + 1]) {
                    swap(arr, j, j + 1);
                    isSwap = true;
                    // curSwapIndex = j;
                    //记下当前交换的索引, 如果这轮交换完成, 这个数字就等于最后一次交换的位置,最后一次交换后面的数字就都是排好序的了.下一轮就不用再比较这往后的数字了, 因为都已经有序
                }
            }
            if (!isSwap) {
                //如果这一轮没有交换,证明已经排序完成了
                break;
            }
            for (var k = len - i - 2; k >= i + 1; k--) {
                if (arr[k] < arr[k - 1]) {
                    swap(arr, k, k - 1);
                    isSwap = true;
                }
            }
            if (!isSwap) {
                //如果这一轮没有交换,证明已经排序完成了
                break;
            }
            // lastSwapIndex = curSwapIndex;
        }
    }

    function sort(arr) {
        var lo = 0,
            hi = arr.length - 1;
        while (lo < hi) {
            var isSwap = false;
            for (var i = lo; i <= hi - 1; i++) {
                if (arr[i] > arr[i + 1]) {
                    swap(arr, i, i + 1);
                    isSwap = true;
                }
            }
            if (!isSwap) break;
            hi--;
            for (var j = hi; j >= lo + 1; j--) {
                if (arr[j - 1] > arr[j]) {
                    swap(arr, j, j - 1);
                    isSwap = true;
                }
            }
            if (!isSwap) break;
            lo++;
        }
    }
    sort(arr);
    return arr;
}

function bubbleSortOrigin(arr) {
    function swap(arr, i, j) {
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    function sort(arr) {
        var len = arr.length
        for (var i = 0; i < len; i++) {
            var isSwap = false;
            for (var j = 0; j < len - 1 - i; j++) {
                //最大的往后挪
                if (arr[j] > arr[j + 1]) {
                    swap(arr, j, j + 1);
                    isSwap = true;
                }
            }
            if (!isSwap) {
                //如果这一轮没有交换,证明已经排序完成了
                break;
            }
        }
    }
    sort(arr);
    return arr;
}

function selectSort(arr) {
    var len = arr.length;
    // function findMin(arr,)
    for (var i = 0; i < len; i++) {
        var minIndex = i;
        var min = arr[minIndex]
        for (var j = i + 1; j < len; j++) {
            if (arr[j] < min) {
                min = arr[j];
                minIndex = j;
            }
        }
        // swap(arr, i, minIndex);
        if (minIndex != i) {
            var temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
        }
    }
    return arr;
}

function insertSort(arr, lo, hi) {
    if (typeof lo === 'undefined') {
        lo = 0;
    }
    if (typeof hi === 'undefined') {
        hi = arr.length - 1;
    }
    // 
    function sort(arr, lo, hi) {
        var len = hi - lo + 1;
        for (var i = lo + 1; i < lo + len; i++) {
            //找到当前值最终的位置index
            var cur = arr[i];
            var index = i - 1;
            while (cur < arr[index] && index >= lo) {
                arr[index + 1] = arr[index];
                index--;
            }
            arr[index + 1] = cur;
        }
        return arr;
    }
    sort(arr, lo, hi);
    return arr;
}
//用插入排序优化后的快排
//
function optQuickSort(arr) {
    function swap(arr, i, j) {
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    function shuffle(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            swap(arr, i, Math.floor(Math.random() * i));
        }
        return arr
    }

    function partition(arr, lo, hi) {
        var pivot = arr[hi];
        var keyIndex = lo;
        for (var i = lo; i < hi; i++) {
            if (arr[i] < pivot) {
                swap(arr, i, keyIndex);
                keyIndex++;
            }
        }
        swap(arr, keyIndex, hi);
        return keyIndex;
    }

    function insert_sort(arr, lo, hi) {
        var len = hi - lo + 1;
        for (var i = lo + 1; i < lo + len; i++) {
            //找到当前值最终的位置index
            var cur = arr[i];
            var index = i - 1;
            while (cur < arr[index] && index >= lo) {
                arr[index + 1] = arr[index];
                index--;
            }
            arr[index + 1] = cur;
        }
        return arr;
    }

    function sort(arr, lo, hi) {
        if (hi - lo <= 10) {
            insert_sort(arr, lo, hi);
            return;
        }
        var keyIndex = partition(arr, lo, hi);
        sort(arr, lo, keyIndex - 1);
        sort(arr, keyIndex + 1, hi);
    }
    shuffle(arr);
    sort(arr, 0, arr.length - 1)
        // console.log(arr.join(','))
    return arr;
}

function optMergeSort(arr) {
    // console.log(arr);
    var shadowArr = new Array(arr.length);

    function merge(arr, lo, mid, hi) {
        for (var i = lo; i < hi + 1; i++) {
            shadowArr[i] = arr[i];
        }
        var leftP = lo;
        var rightP = mid + 1;
        for (var i = lo; i < hi + 1; i++) {
            if (leftP > mid) {
                arr[i] = shadowArr[rightP];
                rightP++;
            } else if (rightP > hi) {
                arr[i] = shadowArr[leftP];
                leftP++;
            } else if (shadowArr[rightP] < shadowArr[leftP]) {
                arr[i] = shadowArr[rightP];
                rightP++;
            } else {
                arr[i] = shadowArr[leftP];
                leftP++;
            }
        }
    }

    function insert_sort(arr, lo, hi) {
        var len = hi - lo + 1;
        for (var i = lo + 1; i < lo + len; i++) {
            //找到当前值最终的位置index
            var cur = arr[i];
            var index = i - 1;
            while (cur < arr[index] && index >= lo) {
                arr[index + 1] = arr[index];
                index--;
            }
            arr[index + 1] = cur;
        }
        return arr;
    }

    function sort(arr, lo, hi) {
        if (hi - lo <= 10) {
            insert_sort(arr, lo, hi);
            return;
        }
        var mid = Math.floor((lo + hi) / 2);
        sort(arr, lo, mid);
        sort(arr, mid + 1, hi);
        merge(arr, lo, mid, hi);
    }
    sort(arr, 0, arr.length - 1);
    // console.log(arr);
    // console.log(arr.join(','));
    return arr;
}

function jsSort(arr) {
    return arr.sort(function(a, b) {
        return a - b;
    });
}
var options = {
        sampleSize: 99,
        arrSize: 99999,
        arrMin: -9999,
        arrMax: 9999
    }
    // testSort(jsSort, options);
    // testSort(quickSort, options);
    // testSort(optQuickSort, options);
    // testSort(mergeSort, options);
    // testSort(optMergeSort, options);
    // testSort(heapSort, options);
    // testSort(selectSort, options);
    // testSort(insertSort, options);
    // testSort(cocktailSort, options);
