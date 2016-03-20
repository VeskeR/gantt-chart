'use strict';

var $ = require('../helper');

var configureChart = function (chartElement, chartJson) {
  // var blocksMapping = createBlocksMapping(chartElement, chartJson);
  configureBlocks(chartElement, chartJson);
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

function configureBlocks(chartElement, chartJson) {
  for (var i = 0; i < chartJson.rows.length; i++) {
    var row = chartJson.rows[i];
    var $blocksContainer = chartElement.querySelectorAll('.chart__cell--blocks-container')[i];
    var containerWidth = $.compStyles($blocksContainer).width;
    for (var j = 0; j < row.blocks.length; j++) {
      var block = row.blocks[j];
      var $block = $blocksContainer.querySelectorAll('.chart__block')[j];

      $block.style.width = getRelativeBlockWidth(
        parseTime(chartJson.startTime),
        parseTime(chartJson.endTime),
        parseTime(block.startTime),
        parseTime(block.endTime),
        parseInt(containerWidth)
      ) + 'px';
      $block.style.left = getRelativeBlockLeftDistance(
        parseTime(chartJson.startTime),
        parseTime(chartJson.endTime),
        parseTime(block.startTime),
        parseInt(containerWidth)
      ) + 'px';
    }
  }
}

function parseTime(stringTime) {
  return new Date(stringTime);
}

function getDaysBetween(firstDate, secondDate) {
  var diff = Math.abs(firstDate.getTime() - secondDate.getTime());
  var daysDiff = Math.ceil(diff / 1000 / 60 / 60 / 24);
  return daysDiff;
}

function getRelativeBlockLeftDistance(chartStartTime, chartEndTime, blockTime, containerWidth) {
  var chartDuration = getDaysBetween(chartStartTime, chartEndTime);
  var daysToBlockStart = getDaysBetween(chartStartTime, blockTime);

  var koff = daysToBlockStart / chartDuration;

  return containerWidth * koff;
}

function getRelativeBlockWidth(chartStartTime, chartEndTime, blockStartTime, blockEndTime, containerWidth) {
  var distToStart = getRelativeBlockLeftDistance(chartStartTime, chartEndTime, blockStartTime, containerWidth);
  var distToEnd = getRelativeBlockLeftDistance(chartStartTime, chartEndTime, blockEndTime, containerWidth);

  return Math.abs(distToEnd - distToStart);
}

module.exports = configureChart;
