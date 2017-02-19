//按时间进行变色的时钟插件
//作者:holy_nova@126.com
//2017年2月17日
;
(function($) {
    function ColorfulTime(elem, options) {
        this.$container = elem;
        this.default = {
            // width: 200,
            // height: 200,
            fontSize: this.$container.height() / 3,
            // frontColor: '#000',
            // reverse: false,
            mode: 0
        };
        this.options = $.extend({}, this.default, options);
    }
    // ColorfulTime1.prototype = {
    //     create: function() {
    //         var that = this;
    //         function toDouble(num) {
    //             return num < 10 ? '0' + num : '' + num;
    //         }
    //         function time2strArr(date, zeroFill) {
    //             if (typeof zeroFill === 'undefined') {
    //                 zeroFill = true;
    //             }
    //             var arr = [];
    //             if (zeroFill) {
    //                 arr.push(toDouble(date.getHours()));
    //                 arr.push(toDouble(date.getMinutes()));
    //                 arr.push(toDouble(date.getSeconds()));
    //             } else {
    //                 arr.push(date.getHours());
    //                 arr.push(date.getMinutes());
    //                 arr.push(date.getSeconds());
    //             }
    //             return arr;
    //         }
    //         function time2color(date) {
    //             var now = {
    //                     h: date.getHours(),
    //                     m: date.getMinutes(),
    //                     s: date.getSeconds()
    //                 }
    //                 // console.log(color);
    //                 // return color;
    //             var colorStr = '';
    //             function rgbArr2ColorStr(rgbArr) {
    //                 rgbArr = rgbArr.map(function(num) {
    //                     return toDouble(num.toString(16));
    //                 });
    //                 return '#' + rgbArr.join('');
    //             }
    //             switch (that.options.mode) {
    //                 case 1:
    //                     //hms直接对应rgb,且不扩展范围
    //                     colorStr = '#' + time2strArr(date).join('');
    //                     break;
    //                 case 2:
    //                     //hms对应rgb,扩展范围比如,[0,23]扩展到[0,255]
    //                     var rgbArr = [Math.round(now.h / 24 * 256), Math.round(now.m / 60 * 256), Math.round(now.s / 60 * 256)]
    //                     colorStr = rgbArr2ColorStr(rgbArr);
    //                     break;
    //                 case 3:
    //                     //第几秒对应第几种颜色映射
    //                     //00:00:01作为第一秒,23:59:59作为最后一秒
    //                     //#000000作为第一种颜色,#FFFFFF作为最后一种颜色,中间的插值
    //                     var cntSeconds = now.h * 3600 + now.m * 60 + now.s;
    //                     // Math.pow(256, 3) / (24 * 3600) = 194.180556
    //                     colorStr = Math.round(cntSeconds * 194.1805556).toString(16);
    //                     colorStr = '#' + colorStr;
    //                     break;
    //                 case 4:
    //                     //hms映射hsl
    //                     var colorArr = hsl2rgb(now.h / 24, now.m / 60, now.s / 60);
    //                     colorStr = rgbArr2ColorStr(colorArr);
    //                     break;
    //                 case 5:
    //                     //hms映射lsh,即hsl的反向
    //                     var colorArr = hsl2rgb(now.s / 60, now.m / 60, now.h / 24);
    //                     colorStr = rgbArr2ColorStr(colorArr);
    //                     break;
    //                 case 6:
    //                     //hms映射lhs
    //                     var colorArr = hsl2rgb(now.m / 60, now.s / 60, now.h / 24);
    //                     colorStr = rgbArr2ColorStr(colorArr);
    //                     break;
    //             }
    //             // console.log('mode ' + that.options.mode + ' :' + colorStr);
    //             return colorStr;
    //         }
    //         function time2str(date) {
    //             return time2strArr(date).join(':');
    //         }
    //         /**
    //          * Converts an HSL color value to RGB. Conversion formula
    //          * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
    //          * Assumes h, s, and l are contained in the set [0, 1] and
    //          * returns r, g, and b in the set [0, 255].
    //          *
    //          * @param   {number}  h       The hue
    //          * @param   {number}  s       The saturation
    //          * @param   {number}  l       The lightness
    //          * @return  {Array}           The RGB representation
    //          */
    //         function hsl2rgb(h, s, l) {
    //             var r, g, b;
    //             if (s == 0) {
    //                 r = g = b = l; // achromatic
    //             } else {
    //                 var hue2rgb = function hue2rgb(p, q, t) {
    //                     if (t < 0) t += 1;
    //                     if (t > 1) t -= 1;
    //                     if (t < 1 / 6) return p + (q - p) * 6 * t;
    //                     if (t < 1 / 2) return q;
    //                     if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    //                     return p;
    //                 }
    //                 var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    //                 var p = 2 * l - q;
    //                 r = hue2rgb(p, q, h + 1 / 3);
    //                 g = hue2rgb(p, q, h);
    //                 b = hue2rgb(p, q, h - 1 / 3);
    //             }
    //             return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    //         }
    //         function frame() {
    //             var now = new Date();
    //             that.$container.html(time2str(now) + '' + time2color(now));
    //             if (that.options.reverse) {
    //                 that.$container.css('color', time2color(now));
    //             } else {
    //                 that.$container.css('backgroundColor', time2color(now));
    //             }
    //         }
    //         function setTimer() {
    //             var timer = null;
    //             timer = setInterval(frame, 1000);
    //         }
    //         function init() {
    //             that.$container.css({
    //                 textAlign: 'center',
    //                 fontSize: that.options.fontSize,
    //                 // color: that.options.frontColor,
    //                 lineHeight: that.$container.height() + 'px',
    //                 transition: 'all 1s'
    //             });
    //             if (that.options.reverse) {
    //                 that.$container.css('backgroundColor', that.options.frontColor);
    //             } else {
    //                 that.$container.css('color', that.options.frontColor);
    //             }
    //             frame();
    //         }
    //         init();
    //         setTimer();
    //     }
    // };
    ColorfulTime.prototype = {
        create: function() {
            var that = this;
            var converter = new DateColorConverter();

            function frame() {
                var now = new Date();

                function changeText() {
                    that.$container.html(converter.date2str(now));
                }

                function changeColor() {
                    var rgb = converter.date2rbg(now, that.options.mode);
                    that.$container.css({
                        color: converter.rgb2hexColor(rgb),
                        backgroundColor: converter.rgb2hexColor(converter.reverseRgb(rgb))
                    });
                }
                changeText();
                changeColor();
            };

            function initStyle() {
                that.$container.css({
                    textAlign: 'center',
                    fontSize: that.options.fontSize,
                    lineHeight: that.$container.height() + 'px',
                    transition: 'all 1s'
                });
            };
            initStyle();
            frame();
            var timer = setInterval(frame, 1000);
        }
    }

    function DateColorConverter() {}
    DateColorConverter.prototype = {
        date2hms: function(date) {
            return {
                h: date.getHours(),
                m: date.getMinutes(),
                s: date.getSeconds()
            }
        },
        date2str: function(date) {
            function fillZero(num) {
                return num < 10 ? '0' + num : '' + num;
            }
            var hms = this.date2hms(date);
            return fillZero(hms.h) + ':' + fillZero(hms.m) + ':' + fillZero(hms.s);
        },
        reverseRgb: function(rgbObj) {
            return {
                r: 255 - rgbObj.r,
                g: 255 - rgbObj.g,
                b: 255 - rgbObj.b
            }
        },
        rgb2hexColor: function(rbgObj) {
            function fillZero(str) {
                return str.length === 1 ? '0' + str : str;
            }
            return '#' +
                fillZero(rbgObj.r.toString(16)) +
                fillZero(rbgObj.g.toString(16)) +
                fillZero(rbgObj.b.toString(16));
        },
        hsl2rgb: function(hslObj) {
            var h = hslObj.h,
                s = hslObj.s,
                l = hslObj.l;
            var r, g, b;
            if (s == 0) {
                r = g = b = l; // achromatic
            } else {
                var hue2rgb = function hue2rgb(p, q, t) {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                }
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }
            return {
                r: Math.round(r * 255),
                g: Math.round(g * 255),
                b: Math.round(b * 255)
            };
        },
        date2rbg: function(date, mode) {
            var that = this;
            var hms = that.date2hms(date);
            var converMethods = [];

            function genTime2hslMethods() {
                var fast = hms.s / 60,
                    middle = hms.m / 60,
                    slow = hms.h / 24;
                var combinations = [
                    [fast, middle, slow],
                    [fast, slow, middle],
                    [middle, fast, slow],
                    [middle, slow, fast],
                    [slow, fast, middle],
                    [slow, middle, fast]
                ];
                for (var i = 0; i < combinations.length; i++) {
                    (function(index) {
                        converMethods.push(
                            function() {
                                var plan = combinations[index];
                                var hsl = {
                                    h: plan[0],
                                    s: plan[1],
                                    l: plan[2],
                                };
                                return that.hsl2rgb(hsl);
                            });
                    })(i);
                }
            }
            genTime2hslMethods();
            if (mode >= converMethods.length) {
                mode = 0;
            }
            return converMethods[mode]();
        },
    };
    $.fn.extend({
        colorfulTime: function(options) {
            return this.each(function() {
                var clock = new ColorfulTime($(this), options);
                clock.create();
            });
        }
    });
})(jQuery);
