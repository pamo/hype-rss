# hype-rss
Simple express server that responds to requests with XML.

Data comes from The [Hype Machine](http://hypem.com/pmocampo)'s JSON feeds.

Why? The default XML feeds on The Hype Machine are cached, making content less predictable and more stale.

The XML feeds can be used with [IFTTT's Feed Channel](https://ifttt.com/feed) to do cool stuff ([like add tracks to a spotify playlist](https://ifttt.com/recipes/429610-save-loved-hype-machine-tracks-to-a-spotify-playlist)).

Code is transpiled with babel before being deployed to Heroku.

* [Loved Tracks](http://hype-rss.herokuapp.com/loved/) | [W3C Valid](validator.w3.org/feed/check.cgi?url=http%3A%2F%2Fhype-rss.herokuapp.com%2Floved)
* [Obsessed Tracks](http://hype-rss.herokuapp.com/obsessed/) | [W3C Valid](validator.w3.org/feed/check.cgi?url=http%3A%2F%2Fhype-rss.herokuapp.com%2Fobsessed)


