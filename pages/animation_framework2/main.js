window.onload = function() {
    var oWrapper = document.querySelector('.wrapper'),
        oBoxes = document.querySelectorAll('.box'),
        styles1 = {
            width: 800,
            height: 100,
            fontSize: 30,
            lineHeight: 100,
            backgroundColor: '#F29C9C'
        },
        styles2 = {
            width: 50,
            height: 50,
            fontSize: 10,
            lineHeight: 50,
            backgroundColor: '#9FE0F6'

        },
        optionsSlowdown = {
            duration: 500,
            easing: "slowdown",
            callback: function() {
                // alert('over');
            },
            FPS: 30

        },
        optionsLinear = {
            duration: 500,
            easing: "linear",
            FPS: 30
        },
        optionsSpeedup = {
            duration: 500,
            easing: "speedup",
            FPS: 30
        };
    EventUtil.addHandler(oWrapper, 'mouseover', move);
    EventUtil.addHandler(oWrapper, 'mouseout', move);
    // EventUtil.addHandler(oWrapper, 'click', move);

    // unitTest();

    function move(event) {
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
        if (hasClass(target, 'box')) {
            var thisStyles = {},
                thisOptions = {};
            if (event.type === 'mouseover') {
                thisStyles = styles1;
            } else if (event.type === 'mouseout') {
                thisStyles = styles2;
            }

            if (hasClass(target, 'slowdown')) {
                thisOptions = optionsSlowdown;
            } else if (hasClass(target, 'speedup')) {
                thisOptions = optionsSpeedup;

            } else if (hasClass(target, 'linear')) {
                thisOptions = optionsLinear;
            }
            animate(target, thisStyles, thisOptions);
        }
        if (hasClass(target, 'trigger')) {
            if (event.type === 'mouseover') {
                animate(oBoxes[0], styles1, {
                    duration: 500,
                    easing: 'linear',
                    FPS: 30,
                    callback: function() {
                        // alert(oBoxes[0].offsetWidth);
                        // console.log('box0 ' + oBoxes[0].offsetWidth);
                    }
                });
                animate(oBoxes[1], styles1, optionsSpeedup);
                animate(oBoxes[2], styles1, {
                    duration: 500,
                    easing: 'slowdown',
                    FPS: 30,
                    callback: function() {
                        // alert(oBoxes[2].offsetWidth);
                        // console.log('box2 ' + oBoxes[2].offsetWidth);

                    }
                });
                // animate(oBoxes[2], styles1, optionsSlowdown);

            } else if (event.type === 'mouseout') {
                animate(oBoxes[0], styles2, optionsLinear);
                animate(oBoxes[1], styles2, optionsSpeedup);
                // animate(oBoxes[2], styles2, optionsSlowdown);
                animate(oBoxes[2], styles2, {
                    duration: 500,
                    easing: 'slowdown',
                    FPS: 30,
                    callback: function() {
                        // alert(oBoxes[2].offsetWidth);
                        // console.log('box2 ' + oBoxes[2].offsetWidth);
                    }
                });

            }

        }

    }
};

function unitTest() {
    console.log(RGB2hex(255, 1, 99));
    //rgb(159, 224, 246)
    //rgb(159, 224, 246)
    console.log(getRGB('rgb(159, 224, 246)'));
    console.log(getRGB('#ff6600'));
    console.log(hex2RGB('#ff6600'));
    console.log(typeof getStyle(document.querySelectorAll('.box')[0], 'backgroundColor'));

}
