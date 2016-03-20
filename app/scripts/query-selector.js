var $ = function(query) {
  return document.querySelectorAll(query);
};

$.first = function(query) {
  return document.querySelector(query);
};

$.create = function(tag) {
  return document.createElement(tag);
};

$.compStyles = function(element) {
  return window.getComputedStyle(element);
}

module.exports = $;
