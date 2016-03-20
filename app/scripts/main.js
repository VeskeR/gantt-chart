'use strict';

var $ = require('./query-selector');
var ChartGenerator = require('./chart-generator');
var chartTempate = require('./chart-template');

var chartTarget = $.first('.wrapper__content--chart-target');

var chartGenerator = new ChartGenerator(chartTarget, chartTempate);
chartGenerator.renderChart();
