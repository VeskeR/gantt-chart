'use strict';

var $ = require('./helper');
var ChartGenerator = require('./chart/chart-generator');
var chartTemplate = require('./constants').chartJsonExample;

var chartTarget = $.first('.wrapper__content--chart-target');

var chartGenerator = new ChartGenerator(chartTarget, chartTemplate, 7);
