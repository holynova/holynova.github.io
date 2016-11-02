window.onload = function() {
    var oBtn = document.getElementById('btnSend'),
        oInputName = document.getElementById('inputName'),
        oInputAbout = document.getElementById('inputAbout');
    // oInputGender = document.getElementsByName('gender');
    oBtn.addEventListener('click', send, false);

    function send() {
        var data = {};
        data.name = escape(oInputName.value);
        data.about = escape(oInputAbout.value);
        data.gender = getRadioValue('gender');
        console.log(JSON.stringify(data));
        ajax('./server/server.js', function(responseText) {
            console.log('get info form server ' + responseText);
        });
    }

    function getRadioValue(name) {
        var radios = document.getElementsByName(name);
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                return radios[i].value;
            }
        }
        return false;
    }
};
