window.onload = windowLoadHandler;

function windowLoadHandler() {
    var btn = document.querySelector('input[type="button"]');
    btnClick();
    btn.addEventListener('click', btnClick, false);
}

function btnClick() {
    var xhttp = new XMLHttpRequest();
    var url = 'https://andruxnet-random-famous-quotes.p.mashape.com/';
    xhttp.addEventListener('readystatechange', function() {
        ajaxHandler(xhttp);
    }, false)
    xhttp.open('post', url, true);
    setHttpHeader(xhttp, {
        "X-Mashape-Key": "v35G9babWmmshnKXNbMYsqlPGg95p1hPxSTjsn5wmwCePeO3NC",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
    })
    xhttp.send(null);
}

function ajaxHandler(xhr) {
    if ((xhr.readyState === 4 && xhr.status === 200) || xhr.status === 304) {
        var json = JSON.parse(xhr.responseText),
            p = document.querySelector('p'),
            span = document.querySelector('span');
        p.innerHTML = json.quote;
        span.innerHTML = json.author;
        randomStyle();
    }
}


function newXHR() {
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    } else {
        return new ActiveXObject('Microsoft.XMLHTTP');
    }
}

function setHttpHeader(xhr, headerData) {
    for (var key in headerData) {
        xhr.setRequestHeader(key, headerData[key]);
    }
}

function randomStyle() {
    var colors = ['#16a085', '#27ae60', '#2c3e50', '#f39c12', '#e74c3c', '#9b59b6', '#FB6964', '#342224', "#472E32", "#BDBB99", "#77B1A9", "#73A857"],
        curColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = curColor;
    document.querySelector('p').style.color = curColor;
    document.querySelector('span').style.color = curColor;
    document.querySelector('input[type="button"]').style.backgroundColor = curColor;

}

// function
