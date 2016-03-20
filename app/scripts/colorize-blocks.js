'use strict';

var $ = require('./query-selector');
var blockColors = require('./block-colors');
var startColorIndex = Math.random() * blockColors.length | 0;

var colorizeBlocks = function (chartElement) {
  var blocks = chartElement.querySelectorAll('.chart__block');
  Array.prototype.forEach.call(blocks, function (block) {
    block.style.backgroundColor = getNextColor();
  });
};

function getRandomColor() {
  return blockColors[Math.random() * blockColors.length | 0];
}

function getNextColor() {
  startColorIndex = ++startColorIndex < blockColors.length ?
                    startColorIndex :
                    0;
  return blockColors[startColorIndex];
}

module.exports = colorizeBlocks;
