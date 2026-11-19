const url = new URL("./footprint.html", location.href);
url.search = location.search;
url.hash = location.hash;
location.replace(url);
