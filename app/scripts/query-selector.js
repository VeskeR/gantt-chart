var $ = function(query) {
  return document.querySelectorAll(query);
}

$.first = function(query) {
  return document.querySelector(query);
}

module.exports = $;
