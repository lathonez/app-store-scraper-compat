'use strict';

var common = require('./common');
var BASE_URL = 'https://itunes.apple.com/lookup';

function app(opts) {
  return new Promise(function (resolve) {
    if (!opts.id && !opts.appId) {
      throw Error('Either id or appId is required');
    }
    var idField = opts.id ? 'id' : 'bundleId';
    var idValue = opts.id || opts.appId;
    var country = opts.country || 'us';
    return resolve(BASE_URL + '?' + idField + '=' + idValue + '&country=' + country);
  }).then(common.request).then(JSON.parse).then(function (res) {
    return new Promise(function (resolve) {
      if (res.results.length === 0) {
        throw Error('App not found (404)');
      }

      resolve(common.cleanApp(res.results[0]));
    });
  });
}

module.exports = app;