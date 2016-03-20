var generateChart = function(chartJson) {
  var chartStartTime = parseTime(chartJson.startTime);
  var chartEndTime = parseTime(chartJson.endTime);
  var chart = '<table></table>';

  function parseTime(stringTime) {
    return new Date(stringTime);
  }
}

module.exports = generateChart;
