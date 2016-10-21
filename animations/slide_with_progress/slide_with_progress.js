window.onload = function() {
    // console.log('ready');
    var oUl = document.getElementsByTagName('ul')[0];
    var oOl = document.getElementsByTagName('ol')[0];
    var aPic = oUl.children;
    var aMark = oOl.getElementsByTagName('span');
    var aMarkLi = oOl.children;
    var picWidth = aPic[0].offsetWidth;
    var markWidth = oOl.children[0].offsetWidth;

    //改成定位布局
    // for (var i = 0; i < aPic.length; i++) {
    //     setStyle(aPic[i], {
    //         display: 'absolute',
    //         top: 0,
    //         left: i * aPic[0].offsetWidth
    //     });
    // }
    //更改布局
    oUl.innerHTML += oUl.innerHTML;
    setStyle(oUl, {
        width: aPic[0].offsetWidth * aPic.length * 2 + "px"
    });

    var timer = null,
        curIndex = 0;
    var picIndex = 1;

    timer = setInterval(function() {
        setStyle(aMarkLi[curIndex], {
            backgroundColor: '#9FE0F6'
        })
        animate(aMark[curIndex], {
            width: markWidth
        }, {
            duration: 1900,
            easing: 'linear',
            callback: function() {
                setStyle(aMarkLi[curIndex], {
                    backgroundColor: '#fff'
                });
                setStyle(aMark[curIndex], {
                    width: 0
                });
                curIndex = (curIndex + 1) % aMark.length;
                nextPic();
            }
        });

    }, 2500);

    function nextPic() {
        // picIndex++;
        animate(oUl, {
            left: -1 * picIndex * picWidth
        }, {
            duration: 500,
            callback: function() {
                picIndex++;
                if (picIndex == aPic.length / 2 + 1) {
                    oUl.style.left = 0;
                    picIndex = 1;
                }

            }
        });
    }

    function setStyle(el, json) {
        for (key in json) {
            el.style[key] = json[key];
        }
    }

};
