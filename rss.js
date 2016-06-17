'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _rss = require('rss');

var _rss2 = _interopRequireDefault(_rss);

var _lodash = require('lodash.pick');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.foreach');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.dropright');

var _lodash6 = _interopRequireDefault(_lodash5);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var xml = void 0;

var fetchJSON = function fetchJSON(path) {

  var feed = new _rss2.default({
    title: 'pmocampo\'s favorite tracks on Hype Machine',
    link: 'http://hypem.com/pmocampo',
    feed_url: 'http://hype-rss.herokuapp.com/' + path,
    site_url: 'http://hype-rss.herokuapp.com/'
  });

  _http2.default.get('http://hypem.com/playlist/' + path + '/pmocampo/json/1/data.js', function (response) {
    var data = [];
    response.on('data', function (chunk) {
      data.push(chunk);
    });
    response.on('end', function () {
      var body = JSON.parse(data.join(''));
      var transformedResponse = [];
      (0, _lodash4.default)(body, function (item) {
        if (item.mediaid) {
          var track = (0, _lodash2.default)(item, ["artist", "title", "dateloved", "mediaid"]);
          var title = track.artist + ' - ' + track.title;
          feed.item({
            guid: track.mediaid,
            title: title,
            date: new Date(track.dateloved * 1000).toUTCString()
          });
        }
      });
      xml = feed.xml({
        indent: true
      });
      console.log(xml);
    });
  }).on('error', function (e) {
    console.log('Got error: ' + e.message);
  });
};

var app = (0, _express2.default)();

app.get('/loved', function (req, res) {
  fetchJSON('loved');
  res.set('Content-Type', 'application/rss+xml');
  res.send(xml);
});

app.get('/obsessed', function (req, res) {
  fetchJSON('obsessed');
  res.set('Content-Type', 'application/rss+xml');
  res.send(xml);
});

var port = process.env.PORT || 8080;
app.listen(port, function () {
  console.log('Listening on port ' + port + '!');
});
