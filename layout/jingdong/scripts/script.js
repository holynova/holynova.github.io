var gData = {
    city: "北京",
    slides: [
        [{
            href: '#',
            imgURL: 'imgs/slide0.jpg'
        }, {
            href: '#',
            imgURL: 'imgs/slide1.jpg'
        }, {
            href: '#',
            imgURL: 'imgs/slide2.jpg'
        }, {
            href: '#',
            imgURL: 'imgs/slide3.jpg'
        }],
    ],
    cartGoods: [{
            href: "#",
            imgURL: 'imgs/cart-good0.jpg',
            num: 1,
            unitPirce: 12.0,
            name: "西部数据(WD)蓝盘 1TB SATA6Gb/s 7200转64M 台式机硬盘(WD10EZEX)"
        }, {
            href: "#",
            imgURL: 'imgs/cart-good0.jpg',
            num: 2,
            unitPirce: 123.0,
            name: "金士顿(Kingston)骇客神条 Fury系列 DDR3 1600 8GB台式机内存(HX316C10F/8)蓝色"
        },

        {
            href: "#",
            imgURL: 'imgs/cart-good0.jpg',
            num: 5,
            unitPirce: 33.4,
            name: "计算机科学丛书：计算机程序的构造和解释（原书第2版）"
        }, {
            href: "#",
            imgURL: 'imgs/cart-good0.jpg',
            num: 1,
            unitPirce: 998.0,
            name: "鸟哥的Linux私房菜 （基础学习篇 第三版）"
        }, {
            href: "#",
            imgURL: 'imgs/cart-good0.jpg',
            num: 20,
            unitPirce: 0.05,
            name: "计算机科学丛书：深入理解计算机系统（原书第2版"
        },

    ]
}
window.onload = function() {
    // console.log('reload');

    //=============================================================================================
    // 轮播图初始化
    var slide1 = new Slide(document.querySelector('.entrance .content .slide'), gData.slides[0]);
    slide1.init();

    //=============================================================================================
    // 购物车处理
    var oCart = document.querySelector('.shopping-cart');
    EventUtil.addHandler(oCart, 'mouseenter', shoppingCartHoverHandler);
    EventUtil.addHandler(oCart, 'mouseleave', shoppingCartHoverHandler);

    function shoppingCartHoverHandler(event) {
        event = EventUtil.getEvent(event);
        // console.log(event.type);
        var target = EventUtil.getTarget(event);
        var oCartGood = oCart.querySelector('.cart-goods');
        var oUl = oCartGood.children[1],
            oTotalNum = oCartGood.children[2].children[0],
            oTotalPrice = oCartGood.children[2].children[1];

        if (event.type === 'mouseenter') {
            var ulHTML = '',
                totalNum = 0,
                totalPrice = 0;
            for (var i = 0; i < gData.cartGoods.length; i++) {
                var g = gData.cartGoods[i];
                ulHTML += '<li class="good-in-cart"><a  herf = "javascript:;" class="pic"><img src="' + g.imgURL +
                    '" alt=""></a><a herf = "javascript:;" class="name" href="">' + g.name +
                    '</a><span class="price">$' + g.unitPirce.toFixed(2) + '×' + g.num +
                    '</span><span class="del" href="">删除</span></li>';
                totalNum += g.num;
                totalPrice += g.unitPirce * g.num;

            }
            oUl.innerHTML = ulHTML;
            oTotalNum.innerHTML = '共' + totalNum + '件商品';
            oTotalPrice.innerHTML = '共计$' + totalPrice.toFixed(2);

            oCartGood.style.display = 'block';
            // oCart.style.background = '#fff';

        } else if (event.type === 'mouseleave') {
            oCartGood.style.display = 'none';

        }

    }

    //=============================================================================================
    //服装鞋包的标签页
    var aClothTabs = document.querySelectorAll('.main-class.cloth .nav .tabs>ul>li');
    var oClothUl = document.querySelector('.main-class.cloth .content>ul');
    var tabWidth = document.querySelector('.main-class.cloth .content>ul>li').offsetWidth;
    // console.log(oClothUl);
    oClothUl.style.width = tabWidth * aClothTabs.length + 'px';
    // EventUtil.addHandler(document.querySelector('.main-class.cloth .nav'), 'mouseover', clothTabHandler);
    for (var i = 0; i < aClothTabs.length; i++) {
        aClothTabs[i].myIndex = i;
        EventUtil.addHandler(aClothTabs[i], 'mouseenter', function() {
            event = EventUtil.getEvent(event);
            var target = EventUtil.getTarget(event);
            for (var i = 0; i < aClothTabs.length; i++) {
                removeClass(aClothTabs[i], 'active');
            }
            addClass(target, 'active');
            // oClothUl.style.marginLeft = -target.myIndex * tabWidth + 'px';
            animate(oClothUl, {
                marginLeft: -target.myIndex * tabWidth
            });

        });
    }

    function clothTabHandler(event) {
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
        console.log(target.tagName);
        if (target.tagName.toUpperCase() === 'LI') {
            for (var i = 0; i < aClothTabs.length; i++) {
                removeClass(aClothTabs[i], 'active');
            }
            addClass(target, 'active');

            oClothUl.style.marginLeft = -target.myIndex * tabWidth + 'px';
        }
    }

    //=============================================================================================
    // 城市选择 
    var oTabCity = document.querySelectorAll('.login-bar ul>li')[0];
    flexTabEvent('city', oTabCity);

    //伸缩标签的事件处理通用程序
    //参数 key:这个标签对应的json中的key
    //参数 oLi:标签的li元素
    // 标签有统一的结构
    // ul
    // |-li
    // |  |-a
    // |  |-table
    function flexTabEvent(key, oLi) {
        var oTag = oLi.querySelector('a'),
            oTable = oLi.querySelector('table'),
            aTd = oTable.querySelectorAll('td');
        EventUtil.addHandler(oLi, 'mouseenter', function() {
            oTable.style.display = 'block';
        });

        EventUtil.addHandler(oLi, 'click', function(event) {
            // oTable.style.display = 'block';
            event = EventUtil.getEvent(event);
            var target = EventUtil.getTarget(event);
            if (target.tagName.toUpperCase() == 'TD') {
                for (var i = 0; i < aTd.length; i++) {
                    // aTd[i].className = '';
                    removeClass(aTd[i], 'active');
                }
                // target.className = 'active';
                addClass(target, 'active');
                gData[key] = target.innerHTML;
                oTag.innerHTML = '送至：' + target.innerHTML;
                oTable.style.display = 'none';
            }
        });

        EventUtil.addHandler(oLi, 'mouseleave', function() {
            oTable.style.display = 'none';
        });

    }

    //=============================================================================================
    // 测试
    // unitTest();

    function unitTest() {
        var s1 = new Slide(document.querySelector('.slide#slide1'), gData.slides[0]);
        var s2 = new Slide(document.querySelector('.slide#slide2'), gData.slides[0]);
        s1.init();
        s2.init();
    }

};
