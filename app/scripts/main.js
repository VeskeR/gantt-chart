'use strict';

var $ = require('./helper');
var ChartGenerator = require('./chart/chart-generator');
var chartTemplate = require('./constants').chartJsonExample;

var chartTarget = $.first('.wrapper__content--chart-target');

var chartGenerator = new ChartGenerator({
  target: chartTarget,
  json: chartTemplate,
  timelineInterval: 7,
  scale: 10
});
// TODO: remove from global
window.chartGenerator = chartGenerator;
