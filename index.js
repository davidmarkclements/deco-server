var decofun = require('decofun');
var express = require('express');
var app = express();
var url = require('url')
var hyperquest = require('hyperquest');
var nid = require('nid');

var Cache = require('mem-cache');
var cache = new Cache({
  timeout: 2.88e7 //8 hours
});

app.use(require('connect-busboy')())

app.get('/', function (req, res) {
  var addr = req.query.addr;
  if (!addr) { 
    return res
      .status(400)
      .send('console.error("deco needs an \'addr\' parameter in the querystring")'); 
  }

  console.log('getting', addr)

  hyperquest(addr, function (err, stream) {
    if (err) { 
      return res
        .status(404)
        .send('console.error("Could not fetch resource \'' + addr + '\' ")') 
    }

    res.writeHead(200, {"Content-Type": "text/plain; charset=UTF-8"});

    var output = '';
    stream.on('data', function (d) {
      output += d;
    }).on('end', function () {

      res.end(decofun(output));
    })
  });


})

app.get('/:id/:file', function (req, res) {
  var file = cache.get(req.params.id + '_' + req.params.file);
  if (!file) { return res.status(404).send('No match'); }
  res.writeHead(200, {"Content-Type": "text/plain; charset=UTF-8"});
  res.end(file);
})

app.post('/', function (req, res) {
  req.busboy.on('file', function (field, file, name) {
    var id = nid();
    var chunks = '';
    file.on('data', function (data) {
      chunks += data;
    }).on('end', function () {
      cache.set(id + '_' + name, chunks);
      res.send(id + '/' + name + '\n'); 
    })

  })

  req.pipe(req.busboy)

})

app.listen(process.env.PORT || 8080)
