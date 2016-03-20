'use strict';

var $ = require('../helper');
var blockColors = require('../constants').blockColors;
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
