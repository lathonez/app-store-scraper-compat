'use strict';

var common = require('./common');
var BASE_URL = 'https://itunes.apple.com/search';
var c = require('./constants');

// TODO allow override country & language
// TODO handle not found

function search(opts) {
  return new Promise(function (resolve) {
    if (!opts.term) {
      throw Error('term is required');
    }

    var entity = opts.device || c.device.ALL;
    var num = opts.num || 50;
    var url = BASE_URL + '?media=software&entity=' + entity + '&term=' + opts.term + '&limit=' + num;
    if (opts.country) {
      url = url + ('&country=' + opts.country);
    }
    return resolve(url);
  }).then(common.request).then(JSON.parse).then(function (res) {
    return res.results.map(common.cleanApp);
  });
}

module.exports = search;