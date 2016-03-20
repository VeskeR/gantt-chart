var $ = function(query) {
  return document.querySelectorAll(query);
}

$.first = function(query) {
  return document.querySelector(query);
}

$.create = function(element) {
  return document.createElement(element);
}

module.exports = $;
