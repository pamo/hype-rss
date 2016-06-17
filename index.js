import http from 'http';
import RSS from 'rss';
import pick from 'lodash.pick';
import forEach from 'lodash.foreach';
import dropRight from 'lodash.dropright';
import express from 'express';
let xml;

const fetchJSON = (path) => {

  let feed = new RSS({
    title: `pmocampo\'s ${path} tracks on Hype Machine`,
    link: `http://hype-rss.herokuapp.com/${path}`,
    feed_url: `http://hype-rss.herokuapp.com/${path}`,
    site_url: `http://hype-rss.herokuapp.com/${path}`
  });

  http.get(`http://hypem.com/playlist/${path}/pmocampo/json/1/data.js`, (response) => {
    let data = [];
    response.on('data', (chunk) => {
      data.push(chunk);
    });
    response.on('end', () => {
      const body = JSON.parse(data.join(''));
      let transformedResponse = [];
      forEach(body, (item) => {
        if (item.mediaid) {
          const track = pick(item, ["artist", "title", "dateloved", "mediaid", "posturl"]);
          const title = `${track.artist} - ${track.title}`;
          feed.item({
            guid: track.mediaid,
            url: track.posturl,
            title,
            date: new Date(track.dateloved * 1000).toUTCString()
          });
        }
      });
      xml = feed.xml({
        indent: true
      });
      console.log(xml);
    });
  }).on('error', (e) => {
    console.log(`Got error: ${e.message}`);
  });
};

var app = express();

app.get('/loved', function(req, res) {
  fetchJSON('loved');
  res.set('Content-Type', 'application/rss+xml');
  res.send(xml);
});

app.get('/obsessed', function(req, res) {
  fetchJSON('obsessed');
  res.set('Content-Type', 'application/rss+xml');
  res.send(xml);
});

const port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log(`Listening on port ${port}!`);
});
