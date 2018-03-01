'use strict';

var R = require('ramda');
var common = require('./common');
var app = require('./app');
var c = require('./constants');

function cleanList(results) {
  var reviews = results.feed.entry || [];
  return reviews.slice(1).map(function (review) {
    return {
      id: review.id.label,
      userName: review.author.name.label,
      userUrl: review.author.uri.label,
      version: review['im:version'].label,
      score: parseInt(review['im:rating'].label),
      title: review.title.label,
      text: review.content.label,
      url: review.link.attributes.href
    };
  });
}

var reviews = function reviews(opts) {
  return new Promise(function (resolve) {
    validate(opts);

    if (opts.id) {
      resolve(opts.id);
    } else if (opts.appId) {
      resolve(app(opts).then(function (app) {
        return app.id;
      }));
    }
  }).then(function (id) {
    opts = opts || {};
    opts.sort = opts.sort || c.sort.RECENT;
    opts.page = opts.page || 1;
    opts.country = opts.country || 'us';

    var url = 'https://itunes.apple.com/' + opts.country + '/rss/customerreviews/page=' + opts.page + '/id=' + id + '/sortby=' + opts.sort + '/json';
    return common.request(url);
  }).then(JSON.parse).then(cleanList);
};

function validate(opts) {
  if (!opts.id && !opts.appId) {
    throw Error('Either id or appId is required');
  }

  if (opts.sort && !R.contains(opts.sort, R.values(c.sort))) {
    throw new Error('Invalid sort ' + opts.sort);
  }

  if (opts.page && opts.page < 1) {
    throw new Error('Page cannot be lower than 1');
  }

  if (opts.page && opts.page > 10) {
    throw new Error('Page cannot be greater than 10');
  }
}

module.exports = reviews;