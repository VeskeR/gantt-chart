'use strict';

var $ = require('../helper');
var BlockTooltip = require('./block-tooltip');
var configureChart = require('./configure-chart');
var blockColors = require('../constants').blockColors;

var ChartGenerator = function (chartTarget, chartJson) {
  this._chartTarget = chartTarget;
  this._chartJson = chartJson;

  this._chartTable = null;
  this._chartTimeline = null;

  this._blockTooltips = [];

  this._blockColorIndex = Math.random() * blockColors.length | 0;
}

ChartGenerator.prototype = {
  renderChart: function (chartTarget, chartJson) {
    this._chartTarget = chartTarget || this._chartTarget;
    this._chartJson = chartJson || this._chartJson;

    this._createChart();
    this._appendChartToTarget();
    this._configureChart();
    this._colorizeBlocks();
    this._createTooltips();
    this._bindEvents();
  },
  _createChart: function () {
    this._chartTable = this._createTable();
    this._chartTimeline = this._createTimeLine();
  },
  _appendChartToTarget: function () {
    this._chartTarget.appendChild(this._chartTable);
    this._chartTarget.appendChild(this._chartTimeline);
  },
  _configureChart: function () {
    configureChart(this._chartTable, this._chartJson);
  },
  _colorizeBlocks: function () {
    var self = this;

    var blocks = this._chartTable.querySelectorAll('.chart__block');
    Array.prototype.forEach.call(blocks, function (block) {
      block.style.backgroundColor = self._getNextBlockColor();
    });
  },
  _createTooltips: function () {
    this._generateTooltipsArray();
    this._initializeTooltips();
  },
  _bindEvents: function () {
    var self = this;

    window.addEventListener('resize', function () {
      self._configureChart();
    });
  },
  _createTable: function () {
    var self = this;

    var $table = $.create('table');
    $table.classList.add('chart');

    this._chartJson.rows.forEach(function (row) {
      var $row = self._createRow(row);
      $table.appendChild($row);
    });

    return $table;
  },
  _createTimeLine: function () {
    var $timeline = $.create('div');
    $timeline.classList.add('chart-timeline');

    return $timeline;
  },
  _createRow: function (row) {
    var $row = $.create('tr');

    $row.classList.add('chart__row');

    var $caption = this._createCaption(row);
    var $blocksContainer = this._createBlocksContainer(row);

    $row.appendChild($caption);
    $row.appendChild($blocksContainer);

    return $row;
  },
  _createCaption: function (row) {
    var $caption = $.create('td');

    $caption.innerHTML = row.name;
    $caption.classList.add('chart__cell');
    $caption.classList.add('chart__cell--blocks-caption');

    return $caption;
  },
  _createBlocksContainer: function (row) {
    var self = this;

    var $blocksContainer = $.create('td');

    $blocksContainer.classList.add('chart__cell');
    $blocksContainer.classList.add('chart__cell--blocks-container');

    row.blocks.forEach(function (block) {
      var $block = self._createBlock(block);
      $blocksContainer.appendChild($block);
    });

    return $blocksContainer;
  },
  _createBlock: function (block) {
    var $block = $.create('div');

    $block.dataset.blockName = block.name;
    $block.classList.add('chart__block');

    return $block;
  },
  _getNextBlockColor: function () {
    this._blockColorIndex = ++this._blockColorIndex < blockColors.length ?
                            this._blockColorIndex :
                            0;
    return blockColors[this._blockColorIndex];
  },
  _getRandomBlockColor: function () {
    return blockColors[Math.random() * blockColors.length | 0];
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
