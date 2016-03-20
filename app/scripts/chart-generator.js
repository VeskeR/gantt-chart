'use strict';

var $ = require('./query-selector');
var generateChartHtml = require('./generate-chart-html');
var configureChart = require('./configure-chart');
var colorizeBlocks = require('./colorize-blocks');

var ChartGenerator = function (chartTarget, chartJson) {
  this._chartTarget = chartTarget;
  this._chartJson = chartJson;
  this._chartElement;
}

ChartGenerator.prototype = {
  renderChart: function (chartTarget, chartJson) {
    var self = this;

    this._chartTarget = chartTarget || this._chartTarget;
    this._chartJson = chartJson || this._chartJson;

    this._createChartElement();
    this._appendChartToTarget();
    this._configureChart();
    this._colorizeBlocks();

    window.addEventListener('resize', function () {
      self._configureChart();
    });
  },
  _createChartElement: function () {
    this._chartElement = generateChartHtml(this._chartJson);
  },
  _appendChartToTarget: function () {
    this._chartTarget.appendChild(this._chartElement);
  },
  _configureChart: function () {
    configureChart(this._chartElement, this._chartJson);
  },
  _colorizeBlocks: function () {
    colorizeBlocks(this._chartElement);
  }
}

module.exports = ChartGenerator;
