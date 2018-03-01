'use strict';

var common = require('./common');
var parseString = require('xml2js').parseString;

var BASE_URL = 'https://search.itunes.apple.com/WebObjects/MZSearchHints.woa/wa/hints?media=software&q=';

function parseXML(string) {
  return new Promise(function (resolve, reject) {
    return parseString(string, function (err, res) {
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    });
  });
}

function extractSuggestions(xml) {
  var toJSON = function toJSON(item) {
    return {
      term: item.string[0],
      priority: item.integer[0]
    };
  };

  var list = xml.plist.dict[0].array[0].dict || [];
  return list.map(toJSON);
}

// TODO see language Accept-Language: en-us, en;q=0.50

function suggest(opts) {
  return new Promise(function (resolve) {
    if (!opts && !opts.term) {
      throw Error('term missing');
    }

    return resolve(BASE_URL + opts.term);
  }).then(common.request).then(parseXML).then(extractSuggestions);
}

module.exports = suggest;