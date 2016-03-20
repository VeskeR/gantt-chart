var $ = require('./query-selector');
var chartTempate = require('./chart-template');
var generateChart = require('./generate-chart');

var chart = generateChart(chartTempate);
console.log(chart);

$.first('.wrapper__content--chart-target').appendChild(chart);
