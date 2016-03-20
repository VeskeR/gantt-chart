'use strict';

var $ = require('./query-selector');
var generateChartHtml = require('./generate-chart-html');
var configureChart = require('./configure-chart');

var ChartGenerator = function (chartTarget, chartJson) {
  this._chartTarget = chartTarget;
  this._chartJson = chartJson;
  this._chartElement;
}

ChartGenerator.prototype = {
  renderChart: function (chartTarget, chartJson) {
    this._chartTarget = chartTarget || this._chartTarget;
    this._chartJson = chartJson || this._chartJson;

    this._createChartElement();
    this._appendChartToTarget();
    console.log('Chart DOM element:');
    console.log(this._chartElement);
    this._configureChart();
  },
  _createChartElement: function () {
    this._chartElement = generateChartHtml(this._chartJson);
  },
  _appendChartToTarget: function () {
    this._chartTarget.appendChild(this._chartElement);
  },
  _configureChart: function () {
    configureChart(this._chartElement, this._chartJson);
  }
}

module.exports = ChartGenerator;
