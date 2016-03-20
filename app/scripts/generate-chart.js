var $ = require('./query-selector');

var generateChart = function(chartJson) {
  var chartStartTime = parseTime(chartJson.startTime);
  var chartEndTime = parseTime(chartJson.endTime);

  var $chart = $.create('table');

  chartJson.rows.forEach(function (row) {
    var $row = $.create('tr');

    var $name = $.create('td');
    $name.innerHTML = row.name;

    var $blocks = $.create('td');

    row.blocks.forEach(function (block) {
      var $block = $.create('div');
      $block.innerHTML = block.name;

      $blocks.appendChild($block);
    });

    $row.appendChild($name);
    $row.appendChild($blocks);

    $chart.appendChild($row);
  });

  return $chart;
}

function parseTime(stringTime) {
  return new Date(stringTime);
}

module.exports = generateChart;
