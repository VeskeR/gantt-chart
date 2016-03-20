var $ = require('./query-selector');
var chartTempate = require('./chart-template');
var ChartGenerator = require('./chart-generator');

var chartTarget = $.first('.wrapper__content--chart-target');

var chartGenerator = new ChartGenerator(chartTarget, chartTempate);
chartGenerator.renderChart();
