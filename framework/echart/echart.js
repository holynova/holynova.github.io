$(document).ready(function() {
    // console.log(genDate(9999));
    showChart(99);
});

function showChart(N) {
    // var $chart = $('.chart');
    var oChart = document.getElementById('chart');
    // var oChart = $('#chart');
    var chart = echarts.init(oChart);

    var option = {
        title: {
            text: 'my echart'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a}<br>{b}<br>{c}'
        },
        xAxis: {
            // data: genDate(N),
            // data: genRandArr(0, 100, N).sort(function(a, b) {
            //     return a - b;
            // }),
            // type: 'categlory'
            type: 'time'
                // type: 'time'
        },
        yAxis: {
            // data: genRandArr(0, 100, N).sort(function(a, b) {
            //     return a - b;
            // }),

            type: 'value'
        },
        toolbox: {
            show: true,
            feature: {
                dataView: {
                    show: true
                },
                magicType: {
                    type: ['line', 'bar', 'stack', 'tiled']
                }
            }

        },
        legend: {
            data: ['合同回款', '实际回款']

        },
        series: [{
            name: '合同回款',
            type: 'scatter',
            symbolSize: 5,
            // step: 'end',
            data: genScatterData(-100, 100, N)
        }, {
            name: '实际回款',
            type: "scatter",
            symbolSize: 5,

            // step: 'end',
            data: genScatterData(0, 100, N)
        }]

    };
    option.xAxis.data =

        chart.setOption(option);
    // $('.chart').html('gogo');
}

function genDate(N) {
    var dates = [];
    for (var i = 0; i < N; i++) {
        var now = new Date();
        now.setDate(randBetween(-100, 100));
        dates.push(now);
    }
    return dates;
}

function randBetween(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}

function genRandArr(min, max, N) {
    var arr = [];
    for (var i = 0; i < N; i++) {
        arr.push(min + Math.floor(Math.random() * (max - min)));
    }
    return arr;
}

function randDate() {
    var now = new Date();
    now.setDate(randBetween(-365, 365));
    return now;
}

function genScatterData(min, max, N) {
    var points = [];
    for (var i = 0; i < N; i++) {
        var point = [];

        point.push(randDate());
        point.push(randBetween(min, max));
        // point.push(randBetween(min, max));
        // for (var j = 0; j < 3; j++) {
        //     point.push(randBetween(min, max));
        // }
        points.push(point);
    }
    return points;
}
