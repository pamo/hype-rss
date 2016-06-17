import http from 'http';
import RSS from 'rss';
import pick from 'lodash.pick';
import forEach from 'lodash.foreach';
import dropRight from 'lodash.dropright';
import express from 'express';

const feed = new RSS({
  title: 'pmocampo\'s favorite tracks on Hype Machine',
  link: 'http://hypem.com/pmocampo'
});
let xml;

const fetchJSON = (path) => {
  http.get(`http://hypem.com/playlist/${path}/pmocampo/json/1/data.js`, (response) => {
    let data = [];
    response.on('data', (chunk) => {
      data.push(chunk);
    });
    response.on('end', () => {
      const body = JSON.parse(data.join(''));
      let transformedResponse = [];
      forEach(body, (item) => {
        const track = pick(item, ["artist", "title", "dateloved", "posturl"]);
        const title = `${track.artist} - ${track.title}`;
        feed.item({
          title,
          url: track.posturl,
          date: new Date(track.dateloved * 1000).toUTCString()
        });
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
