'use strict';

/**
 * Module dependencies.
 */

const Promise = require('bluebird');
const path = require('path');
const fs = require('fs');
const dns = require('native-dns');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_ENV = 'development';
}

const resolveHost = (host) => {
  return new Promise((resolve, reject) => {
    const chunks = host.split('.');

    const isIPv4Addr = chunks.length === 4 && chunks.every((v) => 0 < +v && +v < 255);

    if (isIPv4Addr) {
      return resolve(host);
    }


    dns.lookup(host, (e, hosts) => {
      if (e) {
        return reject(e);
      }

      resolve(hosts instanceof Array ? hosts[0] : hosts);
    });
  });
};

const lookup = (host, rrtype, server) => {
  return new Promise((resolve, reject) => {
    dns.resolve(host, rrtype.toUpperCase(), server, (e, answers) => {
      if (e) {
        return reject(e);
      }

      resolve(answers);
    });
  });
};


app.use(express.static(path.join(__dirname, 'dist/public')));

app.route('/api/lookup')
.get((req, res) => {
  if (!req.query.host) {
    return res.sendStatus(400);
  }

  if (!req.query.rrtype) {
    return res.sendStatus(400);
  }

  if (!req.query.dns) {
    return res.sendStatus(400);
  }


  resolveHost(req.query.dns)
  .then((dnsHost) => lookup(req.query.host, req.query.rrtype, dnsHost))
  .then((answers) => {
    if (!(answers && answers.length)) {
      return res.status(404).send({ error: 'Empty answer', timestamp: Date.now() });
    }

    res.status(200).send({
      answers: answers,
      timestamp: Date.now()
    });
  }).catch((e) => {
    res.status(500).send({ error: e.message, timestamp: Date.now() });
  });
});



app.listen(PORT, () => {
  console.log('Server listening in port %d', PORT);
});
