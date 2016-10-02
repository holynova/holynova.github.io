window.onload = function() {
    // console.log('ready');
    // textCounter.init({
    //     parentId: "box1"
    // }).bind();
    // textCounter.init({
    //     parentId: "box2"
    // }).bind();
    var t1 = TextCounter({
        parentId: 'box1'
    });
    var t2 = TextCounter({
        parentId: 'box2'
    });
    console.log(t1);
    console.log(t2);

};

function TextCounter(config) {
    this.id = new Date().getTime() + 0;

    for (var key in config) {
        this[key] = config[key];

    }
    var that = this;

    this.create = function() {
        var oParent = document.getElementById(that.parentId);
        var oDiv = document.createElement('div');
        oDiv.id = that.id;
        oDiv.innerHTML = '<input type="text" value = "hello"> <span>共有X个字符</span>';
        oParent.appendChild(oDiv);
        that.div = oDiv;
        that.span = oDiv.getElementsByTagName('span')[0];
        that.input = oDiv.getElementsByTagName('input')[0]
            // return this;
    };

    this.bind = function() {
        // var input = document.getElementById(that.id).getElementsByTagName('input')[0];
        // var span = document.getElementById(that.id).getElementsByTagName('span')[0];
        var input = that.input,
            span = that.span;

        input.addEventListener('keyup', function() {
            span.innerHTML = '共有' + TextCounter.prototype.getNum(input) + '个字符';
        }, false);

    };
    // this.getNum = function(inputEl) {
    //     return inputEl.value.length;
    // }

    // function getNum
    this.init = function() {
        this.create();
        this.bind();

    }
    this.init();

}

TextCounter.prototype = {
    getNum: function(inputEl) {
        return inputEl.value.length;

    },
};

var textCounter = {
    div: null,
    init: function(config) {
        var oParent = document.getElementById(config.parentId);
        config.id = new Date().getTime();
        var oDiv = document.createElement('div');
        oDiv.id = config.id;
        oDiv.innerHTML = '<input type="text"> <span>共有X个字符</span>';
        oParent.appendChild(oDiv);
        this.div = oDiv;
        this.span = oDiv.getElementsByTagName('span')[0];
        this.input = oDiv.getElementsByTagName('input')[0]
        return this;
    },
    bind: function() {
        var self = this;
        this.input.addEventListener('keyup', function() {
            self.span.innerHTML = '共有' + self.getNum() + '个字符';
        }, false);

    },
    getNum: function() {
        return this.input.value.length;
    }
};

// var textCount = {
//     input: null,
//     init: function(config) {
//         this.render()
//         this.input = document.getElementById(config.id);
//         this.bind();
//         return this;
//     },
//     render: function() {
//         var self = this;
//         var num = this.getNum();

//         if (this.input.parentNode.querySelectorAll('span.text-count').length === 0) {
//             var span = document.createElement('span');
//             span.className = 'text-count';
//             span.innerHTML = '共计0字符';
//             // span.outerHTML('<span class = "text-count">共计0字符</span>');
//             this.input.parentNode.appendChild(span);
//             // this.input.outerHTML = this.input.outerHTML +
//             //     '<span class = "text-count">共计0字符</span>';
//         }
//         this.input.parentNode.querySelector('span.text-count').innerHTML = '共计' + num + "字符";

//         // this.input = document.getElementById(config.id);
//         // this.input.addEventListener('DOMContentLoaded', function() {
//         //     console.log(this.input.parentNode);
//         //     self.input.parentNode.querySelector('span.text-count').innerHTML = '共计' + num + "字符";
//         // }, false);

//         // setTimeout(function() {
//         //     console.log(self.input.nextSibling);
//         //     self.input.nextSibling.innerHTML = '共计' + num + "字符";
//         //     // self.input.parentNode.querySelector('span.text-count').innerHTML = '共计' + num + "字符";

//         // }, 100);
//     },
//     bind: function() {
//         var self = this;
//         this.input.addEventListener('keyup', function() {
//             self.render();
//         }, false);
//     },
//     getNum: function() {
//         return this.input.value.length;
//     }
// };
