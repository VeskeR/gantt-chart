'use strict';

var $ = require('./query-selector');

var generateChartHtml = function(chartJson) {
  var $chart = $.create('table');
  $chart.classList.add('chart');

  chartJson.rows.forEach(function (row) {
    var $row = $.create('tr');
    $row.classList.add('chart__row');

    var $name = $.create('td');
    $name.innerHTML = row.name;
    $name.classList.add('chart__cell');

    var $blocks = $.create('td');
    $blocks.classList.add('chart__cell');
    $blocks.classList.add('chart__cell--blocks-container');

    row.blocks.forEach(function (block) {
      var $block = $.create('div');
      $block.dataset.blockName = block.name;
      $block.classList.add('chart__block');

      $blocks.appendChild($block);
    });

    $row.appendChild($name);
    $row.appendChild($blocks);

    $chart.appendChild($row);
  });

  return $chart;
}

module.exports = generateChartHtml;
