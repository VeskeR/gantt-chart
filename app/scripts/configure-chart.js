'use strict';

var $ = require('./query-selector');

var configureChart = function (chartElement, chartJson) {
  var chartWidth = $.compStyles(chartElement).width;
  // var blocksMapping = createBlocksMapping(chartElement, chartJson);
}

function createBlocksMapping(chartElement, chartJson) {
  var blocksMapping = {};
  for (var i = 0; i < chartJson.rows.length; i++) {
    var row = chartJson.rows[i];
    var $blocksContainer = chartElement.querySelectorAll('.chart__cell--blocks-container')[i];
    for (var j = 0; j < row.blocks.length; j++) {
      var block = row.blocks[j];
      var $block = $blocksContainer.querySelectorAll('.chart__block')[j];
    }
  }
  return blocksMapping;
}

function parseTime(stringTime) {
  return new Date(stringTime);
}

function getDaysBetween(firstDate, secondDate) {
  var diff = Math.abs(firstDate.getTime() - secondDate.getTime());
  var daysDiff = Math.ceil(diff / 1000 / 60 / 60 / 24);
  return daysDiff;
}

module.exports = configureChart;
