'use strict';

var $ = require('../helper');
var BlockTooltip = require('./block-tooltip');
var generateChartHtml = require('./generate-chart-html');
var configureChart = require('./configure-chart');
var colorizeBlocks = require('./colorize-blocks');

var ChartGenerator = function (chartTarget, chartJson) {
  this._chartTarget = chartTarget;
  this._chartJson = chartJson;
  this._chartTable = null;
  this._chartTimeline = null;
  this._blockTooltips = [];
}

ChartGenerator.prototype = {
  renderChart: function (chartTarget, chartJson) {
    var self = this;

    this._chartTarget = chartTarget || this._chartTarget;
    this._chartJson = chartJson || this._chartJson;

    this._createChartElement();
    this._appendChartTableToTarget();
    this._appendChartTimelineToTarget();
    this._configureChart();
    this._colorizeBlocks();
    this._createTooltips();

    window.addEventListener('resize', function () {
      self._configureChart();
    });
  },
  _createChartElement: function () {
    var chartInfo = generateChartHtml(this._chartJson);
    this._chartTable = chartInfo[0];
    this._chartTimeline = chartInfo[1];
  },
  _appendChartTableToTarget: function () {
    this._chartTarget.appendChild(this._chartTable);
  },
  _appendChartTimelineToTarget: function () {
    this._chartTarget.appendChild(this._chartTimeline);
  },
  _configureChart: function () {
    configureChart(this._chartTable, this._chartJson);
  },
  _colorizeBlocks: function () {
    colorizeBlocks(this._chartTable);
  },
  _createTooltips: function () {
    this._generateTooltipsArray();
    this._initializeTooltips();
  },
  _generateTooltipsArray: function () {
    for (var i = 0; i < this._chartJson.rows.length; i++) {
      var row = this._chartJson.rows[i];
      var $blocksContainer = this._chartTable.querySelectorAll('.chart__cell--blocks-container')[i];
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
