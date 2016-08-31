window.onload = windowLoad;

function windowLoad() {
    test3();

}

function test1() {
    var p = document.getElementsByTagName('p')[0];
    document.onkeydown = function(event) {
        event = event || window.event;
        if (event.key === 'a') {
            p.innerHTML += ',' + event.key;
            document.onclick = function(event) {
                event = event || window.event;
                console.log('clicked');

            };
        }
    };

}

function test2() {
    var p = document.getElementsByTagName('p')[0];
    EventUtil.addEvent(document, 'keydown', keydownHandler);
    EventUtil.addEvent(document, 'keyup', keyupHandler);

    function keydownHandler(event) {
        var key = -1;
        event = event || window.event;
        if (event.key) {
            key = event.key;
        } else {
            key = String.fromCharCode(event.keyCode).toLowerCase();
        }
        console.log(key);
        if (key === 'a') {
            console.log('a按下了');
            p.innerHTML += ' a按下了';
            EventUtil.addEvent(document, 'keydown', twokeyHandler);
            // document.addEventListener('keydown', twokeyHandler, false);
        }
    }

    function twokeyHandler(event) {
        event = event || window.event;
        var key = event.key ? event.key : String.fromCharCode(event.keyCode).toLowerCase();
        if (key === 'b') {
            p.innerHTML += ' a+b同时按下了';
            console.log('a+b 同时按下了');
        }
    }

    function keyupHandler(event) {
        event = event || window.event;
        var key = event.key ? event.key : String.fromCharCode(event.keyCode).toLowerCase();
        if (key === 'a') {
            p.innerHTML += ',a抬起了';
            console.log('a抬起了');
            EventUtil.removeEvent(document, 'keydown', twokeyHandler);
        }
    }



}

function test3() {
    // body...  
    var p = document.getElementsByTagName('p')[0];
    var isA = false,
        isD = false,
        isS = false,
        isF = false;
    EventUtil.addEvent(document, 'keydown', downHandler);
    EventUtil.addEvent(document, 'keyup', upHandler);

    function downHandler(event) {
        event = event || window.event;
        var key = event.key ? event.key : String.fromCharCode(event.keyCode).toLowerCase();
        console.log('keydown:' + key);
        switch (key) {
            case 'a':
                isA　 = true;
                break;
            case 's':
                isS = true;
                break;
            case 'd':
                isD = true;
                break;
            case 'f':
                isF = true;
                break;
            default:
                break;
        }
        if (isA && isD && isS && isF) {
            console.log('asdf同时按下了');
            p.innerHTML += 'asdf同时按下了';
        }
    }

    function upHandler(event) {
        event = event || window.event;
        var key = event.key ? event.key : String.fromCharCode(event.keyCode).toLowerCase();
        console.log('keyup:' + key);

        switch (key) {
            case 'a':
                isA　 = false;
                break;
            case 's':
                isS = false;
                break;
            case 'd':
                isD = false;
                break;
            case 'f':
                isF = false;
                break;
            default:
                break;
        }

    }


}

var EventUtil = {
    'addEvent': function(elem, event, func) {
        elem.attachEvent ? elem.attachEvent('on' + event, func) : elem.addEventListener(event, func, false);
    },
    'removeEvent': function(elem, event, func) {
        elem.detachEvent ? elem.detachEvent('on' + event, func) : elem.removeEventListener(event, func);

    }
};
