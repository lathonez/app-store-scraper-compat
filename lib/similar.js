'use strict';

var app = require('./app');
var BASE_URL = 'https://itunes.apple.com/us/app/app/id';
var LOOKUP_URL = 'https://itunes.apple.com/lookup?id=';
var common = require('./common.js');
var c = require('./constants.js');

function storeId(countryCode) {
  var markets = c.markets;
  var defaultStore = '143441';
  return countryCode && markets[countryCode.toUpperCase()] || defaultStore;
}

function similar(opts) {
  return new Promise(function (resolve, reject) {
    if (opts.id) {
      resolve(opts.id);
    } else if (opts.appId) {
      app(opts).then(function (app) {
        return resolve(app.id);
      }).catch(reject);
    } else {
      throw Error('Either id or appId is required');
    }
  }).then(function (id) {
    return common.request('' + BASE_URL + id, {
      'X-Apple-Store-Front': storeId(opts.country) + ',32'
    });
  }).then(function (text) {
    var index = text.indexOf('customersAlsoBoughtApps');
    if (index === -1) {
      return [];
    }

    var slice = text.slice(index, index + 300).match(/\[(.*)\]/)[0];
    var ids = JSON.parse(slice);
    return common.request(LOOKUP_URL + ids.join(',')).then(JSON.parse).then(function (res) {
      return res.results.map(common.cleanApp);
    });
  });
}

module.exports = similar;