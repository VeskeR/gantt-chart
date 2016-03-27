'use strict';

var $ = function (query) {
  return document.querySelectorAll(query);
};

$.first = function (query) {
  return document.querySelector(query);
};

$.create = function (tag) {
  return document.createElement(tag);
};

$.compStyles = function (element) {
  return window.getComputedStyle(element);
};

$.tryParseDate = function (date) {
  if (date && !!Date.parse(date)) {
    return new Date(date);
  } else {
    throw new TypeError('Not valid date format was specified.');
  }
};

$.formatDate = function (date) {
  return date.toDateString().substr(4);
};

module.exports = $;
