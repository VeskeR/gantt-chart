'use strict';

var $ = require('./query-selector');

var generateChartHtml = function(chartJson) {
  var $table = generateTable(chartJson);
  var $timeline = generateTimeLine(chartJson);

  return [$table, $timeline];
}

function generateTable(chartJson) {
  var $table = $.create('table');
  $table.classList.add('chart');

  chartJson.rows.forEach(function (row) {
    var $row = generateRow(row);
    $table.appendChild($row);
  });

  return $table;
}

function generateRow(row) {
  var $row = $.create('tr');

  $row.classList.add('chart__row');

  var $caption = generateCaption(row);
  var $blocksContainer = generateBlocksContainer(row);

  $row.appendChild($caption);
  $row.appendChild($blocksContainer);

  return $row;
}

function generateCaption(row) {
  var $caption = $.create('td');

  $caption.innerHTML = row.name;
  $caption.classList.add('chart__cell');
  $caption.classList.add('chart__cell--blocks-caption');

  return $caption;
}

function generateBlocksContainer(row) {
  var $blocksContainer = $.create('td');

  $blocksContainer.classList.add('chart__cell');
  $blocksContainer.classList.add('chart__cell--blocks-container');

  row.blocks.forEach(function (block) {
    var $block = generateBlock(block);
    $blocksContainer.appendChild($block);
  });

  return $blocksContainer;
}

function generateBlock(block) {
  var $block = $.create('div');

  $block.dataset.blockName = block.name;
  $block.classList.add('chart__block');

  return $block;
}

function generateTimeLine(chartTimeStart, chartTimeEnd, interval) {
  var $timeline = $.create('div');
  $timeline.classList.add('chart-timeline');

  return $timeline;
}


module.exports = generateChartHtml;
