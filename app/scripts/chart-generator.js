'use strict';

var $ = require('./query-selector');
var BlockTooltip = require('./block-tooltip');
var generateChartHtml = require('./generate-chart-html');
var configureChart = require('./configure-chart');
var colorizeBlocks = require('./colorize-blocks');

var ChartGenerator = function (chartTarget, chartJson) {
  this._chartTarget = chartTarget;
  this._chartJson = chartJson;
  this._chartElement = null;
  this._blockTooltips = [];
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
    this._createTooltips();

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
  },
  _createTooltips: function () {
    this._generateTooltipsArray();
    this._initializeTooltips();
  },
  _generateTooltipsArray: function () {
    for (var i = 0; i < this._chartJson.rows.length; i++) {
      var row = this._chartJson.rows[i];
      var $blocksContainer = this._chartElement.querySelectorAll('.chart__cell--blocks-container')[i];
      for (var j = 0; j < row.blocks.length; j++) {
        var block = row.blocks[j];
        var $block = $blocksContainer.querySelectorAll('.chart__block')[j];

        this._blockTooltips.push(new BlockTooltip($block, block));
      }
    }
  },
  _initializeTooltips: function () {
    this._blockTooltips.forEach(function (tooltip) {
      tooltip.init();
    });
  }
};

module.exports = ChartGenerator;
