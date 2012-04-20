var jsdom  = require('jsdom'),
    http = require('http'),
    fs     = require('fs'),
    jquery = fs.readFileSync("./js/jquery.js").toString(),
    url = 'http://www.aio.com.tw/wall',
    lists = [],
    path = './data/';

// fetch image function.
function fetchImg (url) {
    jsdom.env({
      html: url,
      src: [
        jquery
      ],
      done: function(errors, window) {
        var $ = window.$;
        $("img").each(function (idx, el) {
            var nodeSrc = $(el).attr("src");
            lists.push(nodeSrc);
        });
        // save image
        saveImage(lists.pop(), path);
      }
    });
}



function saveImage (url, filepath) {
    if ( ! url.match(/^http:\/\//)) {
        return;
    }

    var urls = url.replace("http://", "").split("/"),
        options = {
            host: urls.shift(),
            port: 80,
            path: urls.join("/")
        };

    http.get(options, function(res){
        var imagedata = '';
        res.setEncoding('binary');

        res.on('data', function(chunk){
            imagedata += chunk
        });

        res.on('end', function(){
            var fullname = filepath + urls.pop();
            fs.writeFile(fullname, imagedata, 'binary', function(err){
            //    if (err) throw err
                console.log('File saved : ' + fullname);
                if (lists.length > 0) {
                    saveImage(lists.pop(), path);
                }
            });
        });

    });

}

fetchImg(url);
console.log("Starting....enjoy it!");
