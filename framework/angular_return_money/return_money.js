(function() {
    var app = angular.module('myApp', []);
    app.controller('myCtrl', ['$scope', function($scope) {
        var today = new Date();
        $scope.borrowData = [{
            date: today,
            value: 1000
        }];
        $scope.returnData = [{
            date: today,
            value: 1000
        }, ];
        $scope.borrowSum = 0;
        $scope.returnSum = 0;
        $scope.baseArr = [{
            value: 4.35,
            text: "定期贷款-六个月-4.35%"
        }, {
            value: 4.35,
            text: "定期贷款-六个月至一年-4.35%"
        }, {
            value: 4.75,
            text: "定期贷款-一至三年-4.75%"
        }, {
            value: 4.75,
            text: "定期贷款-三至五年-4.75%"
        }, {
            value: 4.9,
            text: "定期贷款-五年以上-4.9%"
        }, {
            value: 0.3,
            text: "存款-活期-0.3%"
        }, {
            value: 1.35,
            text: "定期存款-三个月-1.35%"
        }, {
            value: 1.55,
            text: "定期存款-半年-1.55%"
        }, {
            value: 1.75,
            text: "定期存款-一年-1.75%"
        }, {
            value: 2.25,
            text: "定期存款-二年-2.25%"
        }, {
            value: 2.75,
            text: "定期存款-三年-2.75%"
        }, {
            value: 2.75,
            text: "定期存款-五年-2.75%"
        }, {
            value: 1,
            text: "自定义-1%"
        }];
        $scope.ratio = 1.0;
        $scope.selectBase = $scope.baseArr[0];
        $scope.interest = $scope.selectBase.value * $scope.ratio;
        // $scope.interest = {
        //     baseArr: [{
        //         value: 4.35,
        //         text: "定期贷款-六个月-4.35%"
        //     }, {
        //         value: 4.35,
        //         text: "定期贷款-六个月至一年-4.35%"
        //     }, {
        //         value: 4.75,
        //         text: "定期贷款-一至三年-4.75%"
        //     }, {
        //         value: 4.75,
        //         text: "定期贷款-三至五年-4.75%"
        //     }, {
        //         value: 4.9,
        //         text: "定期贷款-五年以上-4.9%"
        //     }, {
        //         value: 0.3,
        //         text: "存款-活期-0.3%"
        //     }, {
        //         value: 1.35,
        //         text: "定期存款-三个月-1.35%"
        //     }, {
        //         value: 1.55,
        //         text: "定期存款-半年-1.55%"
        //     }, {
        //         value: 1.75,
        //         text: "定期存款-一年-1.75%"
        //     }, {
        //         value: 2.25,
        //         text: "定期存款-二年-2.25%"
        //     }, {
        //         value: 2.75,
        //         text: "定期存款-三年-2.75%"
        //     }, {
        //         value: 2.75,
        //         text: "定期存款-五年-2.75%"
        //     }, {
        //         value: 1,
        //         text: "自定义-1%"
        //     }],
        //     selectBase :$scope.interest.baseArr[0],
        //     base: $scope.sl,
        //     ratio: 1.0,
        //     interest: 4.35,
        // };
        $scope.changeRow = function(mode, type, item) {
            //mode = add|del
            //type = 'borrow'|'return'
            //item 当mode=add时,item可以省略
            var dataArr = (type === 'borrow') ? $scope.borrowData : $scope.returnData;
            if (mode === 'add') {
                dataArr.push({
                    date: new Date(),
                    value: 0
                });
            } else if (mode === 'del') {
                if (typeof item === 'undefined') return;
                var index = dataArr.indexOf(item);
                dataArr.splice(index, 1);
            }
            // $scope.refreshSum(type);
        };
        $scope.lastReturnDate = 0;
        $scope.totalInterest = 0;
        $scope.getLastReturnDate = function() {
            var lastDate = 0;
            for (var i = 0, len = $scope.returnData.length; i < len; i++) {
                var rowDate = $scope.returnData[i].date;
                if (rowDate > lastDate) {
                    lastDate = rowDate;
                }
            }
            // lastDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
            lastDate = formatDate(lastDate);
            $scope.lastReturnDate = lastDate;
            return lastDate;
        };
        $scope.calculateInterest = function() {
            $scope.getLastReturnDate();
            var borrowInterest = 0;
            var returnInterest = 0;
            var interest = $scope.selectBase.value * $scope.ratio / 100;
            for (var i = 0, len = $scope.borrowData.length; i < len; i++) {
                var row = $scope.borrowData[i];
                var rowInterest = row.value * ($scope.lastReturnDate - formatDate(row.date)) / (1000 * 24 * 3600) * interest / 365;
                borrowInterest += rowInterest;
                row.interest = rowInterest;
                row.interval = ($scope.lastReturnDate - formatDate(row.date)) / (1000 * 24 * 3600);
            }
            for (var i = 0, len = $scope.returnData.length; i < len; i++) {
                var row = $scope.returnData[i];
                var rowInterest = row.value * ($scope.lastReturnDate - formatDate(row.date)) / (1000 * 24 * 3600) * interest / 365;
                returnInterest += rowInterest;
                row.interest = rowInterest;
                row.interval = ($scope.lastReturnDate - formatDate(row.date)) / (1000 * 24 * 3600);
            }
            var totalInterest = borrowInterest - returnInterest;
            $scope.totalInterest = totalInterest;
            var canvasElem = document.getElementsByTagName('canvas')[0];
            plotDateChart(canvasElem, $scope.borrowData, $scope.returnData);
            return totalInterest;
        };
        // $scope.refreshResult = function() {
        //     $scope.getLastReturnDate();
        //     $scope.calculateInterest();
        // };
        $scope.getInterest = function() {
            var res = ($scope.selectBase.value * $scope.ratio).toFixed(2);
            $scope.interest = res;
            return res;
        };
        $scope.getSum = function(type) {
            var sum = 0;
            if (type === 'borrow') {
                for (var i = 0, len = $scope.borrowData.length; i < len; i++) {
                    sum += $scope.borrowData[i].value;
                }
                $scope.borrowSum = sum;
                return sum;
            } else if (type === 'return') {
                for (var i = 0, len = $scope.returnData.length; i < len; i++) {
                    sum += $scope.returnData[i].value;
                }
                $scope.returnSum = sum;
                return sum;
            }
        };
        $scope.isSelectd = function(value) {
            // return value == $scope.
        };

        function formatDate(date) {
            var year = date.getFullYear(),
                month = date.getMonth(),
                day = date.getDate();
            return new Date(year, month, day);
        }
        // plotDateChart();
    }]);
})();
