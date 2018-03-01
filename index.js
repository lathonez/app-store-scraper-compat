'use strict';

var R = require('ramda');
var memoizee = require('memoizee');
var constants = require('./lib/constants');

var methods = {
  app: require('./lib/app'),
  list: require('./lib/list'),
  search: require('./lib/search'),
  suggest: require('./lib/suggest'),
  similar: require('./lib/similar'),
  reviews: require('./lib/reviews')
};

function memoized(opts) {
  var cacheOpts = Object.assign({
    primitive: true,
    normalizer: JSON.stringify,
    maxAge: 1000 * 60 * 5, // cache for 5 minutes
    max: 1000 // save up to 1k results to avoid memory issues
  }, opts);
  var doMemoize = function doMemoize(fn) {
    return memoizee(fn, cacheOpts);
  };
  return Object.assign({}, constants, R.map(doMemoize, methods));
}

module.exports = Object.assign({ memoized: memoized }, constants, methods);
