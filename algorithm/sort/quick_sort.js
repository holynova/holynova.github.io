function quickSort(arr) {
    function shuffle(arr) {
        for (var i = arr.length - 1; i >= 1; i--) {
            swap(arr, i, Math.floor(Math.random() * i));
        }
    }

    function partition(arr, left, right) {
        var pivot = arr[right];
        var storedIndex = left;
        for (var i = left; i < right; i++) {
            if (arr[i] <= pivot) {
                swap(arr, storedIndex, i);
                storedIndex++;
            }
        }
        swap(arr, right, storedIndex);
        return storedIndex;
    }

    function swap(arr, i, j) {
        if (i === j) return;
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        // return arr;
    }

    function sort(arr, left, right) {
        if (left >= right) return;
        var storedIndex = partition(arr, left, right);
        sort(arr, left, storedIndex - 1);
        sort(arr, storedIndex + 1, right);
    }
    shuffle(arr);
    sort(arr, 0, arr.length - 1);
    return arr;
    // shuffle(arr);
    // console.log(arr)
}

function genArr(N, min, max) {
    if (typeof N == "undefined") N = 100;
    if (typeof min == "undefined") min = 0;
    if (typeof max == "undefined") max = 100;
    var arr = [];
    for (var i = 0; i < N; i++) {
        var num = Math.floor(Math.random() * (max - min)) + min;
        arr.push(num);
    }
    return arr;
}

function testSort(sortFunc, N, show) {
    if (typeof N == 'undefined') {
        N = 100000;
    }
    if (typeof show == 'undefined') {
        show = false;
    }
    var arr = genArr(N, -1000, 1000);
    var arrClone = arr.slice();
    if (show) {
        console.log(arr);
    }
    sortFunc(arr);
    if (show) {
        console.log(arr);
    }
    arrClone.sort(function(a, b) {
        return a - b;
    });
    console.log(isArrEqual(arr, arrClone) ? 'correct' : "error");
}

function isArrEqual(arr1, arr2) {
    return JSON.stringify(arr1) == JSON.stringify(arr2);
}

function unitTest() {
    var arr = genArr(20, -1000, 1000);
    console.log(arr);
    quickSort(arr);
    console.log(arr);
}

function mergeSortBottom(arr) {
    //建立临时数组
    var arrClone = []
    for (var i = 0; i < arr.length; i++) {
        arrClone.push(0);
    }

    function merge(arr, lo, mid, hi) {
        for (var i = lo; i <= hi; i++) {
            arrClone[i] = arr[i];
        }
        var i = lo,
            j = mid;
        for (var cnt = lo; cnt <= hi; cnt++) {
            if (i > mid - 1) {
                arr[cnt] = arrClone[j];
                j++;
            } else if (j > hi) {
                arr[cnt] = arrClone[i];
                i++;
            } else if (arrClone[i] < arrClone[j]) {
                arr[cnt] = arrClone[i];
                i++;
            } else {
                arr[cnt] = arrClone[j];
                j++;
            }
        }
    }
    for (var size = 1; size < arr.length; size += size) {
        for (var lo = 0; lo < arr.length - size; lo += size + size) {
            var mid = lo + size,
                hi = Math.min(lo + size + size - 1, arr.length - 1);
            // console.log('merge(%d,%d,%d)', lo, mid, hi);
            merge(arr, lo, mid, hi);
        }
    }
    return arr;
}

function mergeSortTop(arr) {
    //建立临时数组
    var arrClone = []
    for (var i = 0; i < arr.length; i++) {
        arrClone.push(0);
    }

    function merge(arr, lo, mid, hi) {
        for (var i = lo; i <= hi; i++) {
            arrClone[i] = arr[i];
        }
        var i = lo,
            j = mid;
        for (var cnt = lo; cnt <= hi; cnt++) {
            if (i > mid - 1) {
                arr[cnt] = arrClone[j];
                j++;
            } else if (j > hi) {
                arr[cnt] = arrClone[i];
                i++;
            } else if (arrClone[i] < arrClone[j]) {
                arr[cnt] = arrClone[i];
                i++;
            } else {
                arr[cnt] = arrClone[j];
                j++;
            }
        }
    }

    function sort(arr, lo, hi) {
        if (hi <= lo) {
            return;
        }
        var mid = Math.ceil((lo + hi) / 2);
        sort(arr, lo, mid - 1);
        sort(arr, mid, hi);
        merge(arr, lo, mid, hi);
    }
    sort(arr, 0, arr.length - 1);
    return arr;
}
// unitTest();
// testSort(mergeSortTop, 10, true);
//2016年11月7日 每日练习
function quickSort20161107(arr) {
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
            break;
        }
        var keyIndex = partition(arr, lo, hi);
        sort(arr, lo, keyIndex - 1);
        sort(arr, keyIndex + 1, hi);
    }
    sort(arr, 0, arr.length - 1)
    return arr;
}
