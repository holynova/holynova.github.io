// AjaxUtil = {};
function ajax_old(url, successFunc, failFunc, options) {
    if (typeof options === 'undefined') {
        options = {
            method: 'GET',
        }
    }
    var xhr = new XMLHttpRequest();
    xhr.open(options.method, url, true)
    xhr.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 400) {
                if (typeof successFunc !== "undefined") {
                    successFunc(this.responseText);
                }
            } else {
                if (typeof failFunc !== "undefined") {
                    failFunc(this.status);
                }
            }
        }
    };
    xhr.send();
}

function ajax
