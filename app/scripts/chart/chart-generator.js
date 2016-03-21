'use strict';

var $ = require('../helper');
var BlockTooltip = require('./block-tooltip');
var blockColors = require('../constants').blockColors;

var ChartGenerator = function (chartTarget, chartJson, timelineInterval) {
  this._chartTarget = chartTarget;
  this._chartJson = chartJson;
  this._timelineInterval = timelineInterval || 7;

  this._chartTable = null;
  this._chartTimeline = null;

  this._blockTooltips = [];

  this._currBlockColorIndex = Math.random() * blockColors.length | 0;

  this._controller();
}

ChartGenerator.prototype = {
  renderChart: function (chartTarget, chartJson, timelineInterval) {
    this._chartTarget = chartTarget || this._chartTarget;
    this._chartJson = chartJson || this._chartJson;
    this._timelineInterval = timelineInterval || this._timelineInterval;

    this._createChart();
    this._appendChartToTarget();
    this._setBlocksPositions();
    this._colorizeBlocks();
    this._createTooltips();
    this._bindEvents();
  },
  _controller: function () {
    this._processChartJson();

    this._chartDuration = this._chartDuration ||
                          this._getDaysBetweenDates(
                            this._chartJson.startTime,
                            this._chartJson.endTime
                          );
  },
  _processChartJson: function () {
    this._chartJson.startTime = new Date(this._chartJson.startTime);
    this._chartJson.endTime = new Date(this._chartJson.endTime);
    this._chartJson.rows.forEach(function (row) {
      row.blocks.forEach(function (block) {
        block.startTime = new Date(block.startTime);
        block.endTime = new Date(block.endTime);
      });
    });
  },
  _getDaysBetweenDates: function (firstDate, secondDate) {
    firstDate = firstDate || new Date(0);
    secondDate = secondDate || new Date(0);

    var diff = Math.abs(firstDate.getTime() - secondDate.getTime());
    var daysDiff = Math.ceil(diff / 1000 / 60 / 60 / 24);

    return daysDiff;
  },
  _createChart: function () {
    this._chartTable = this._createTable();
    this._chartTimeline = this._createTimeline();
  },
  _appendChartToTarget: function () {
    this._chartTarget.appendChild(this._chartTable);
    this._chartTarget.appendChild(this._chartTimeline);
  },
  _setBlocksPositions: function () {
    for (var i = 0; i < this._chartJson.rows.length; i++) {
      var row = this._chartJson.rows[i];
      var $blocksContainer = this._chartTable.querySelectorAll('.chart__cell--blocks-container')[i];
      var containerWidth = $.compStyles($blocksContainer).width;

      for (var j = 0; j < row.blocks.length; j++) {
        var block = row.blocks[j];
        var $block = $blocksContainer.querySelectorAll('.chart__block')[j];

        var blockPositionInfo = this._getRelativePositionInfo(
          block.startTime,
          block.endTime,
          containerWidth
        );

        $block.style.width = blockPositionInfo.widthPercents;
        $block.style.left = blockPositionInfo.leftPercents;
      }
    }
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
      // self._setBlocksPositions();
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
  _createTimeline: function () {
    var self = this;
    var $timeline = $.create('div');
    $timeline.classList.add('chart-timeline');

    var breakpointsCount = this._getTimelineBreakpointsCount();
    var breakpoints = this._getTimelineBreakpoints(breakpointsCount);

    breakpoints.forEach(function (breakpoint) {
      var $breakpoint = self._createBreakpoint(breakpoint);
      $timeline.appendChild($breakpoint);
    });

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
  _getTimelineBreakpointsCount: function () {
    return Math.round(this._chartDuration / this._timelineInterval) + 1;
  },
  _getTimelineBreakpoints: function (count) {
    var breakpoints = [];
    var currBreakpointDate = new Date(this._chartJson.startTime);

    for (var i = 0; i < count; i++) {
      if (currBreakpointDate > this._chartJson.endTime) {
        currBreakpointDate = new Date(this._chartJson.endTime);
      }
      breakpoints.push(new Date(currBreakpointDate));
      currBreakpointDate.setDate(currBreakpointDate.getDate() + this._timelineInterval);
    }

    return breakpoints;
  },
  _createBreakpoint: function (breakpoint) {
    var $breakpoint = $.create('div');

    $breakpoint.classList.add('chart-timeline__breakpoint');
    $breakpoint.innerHTML = breakpoint.toLocaleDateString();

    return $breakpoint;
  },
  _getRelativePositionInfo: function (startTime, endTime, containerWidth) {
    startTime = startTime || new Date(0);
    endTime = endTime || new Date(0);
    containerWidth = parseInt(containerWidth) || 0;

    var chartStartTime = this._chartJson.startTime;
    var chartEndTime = this._chartJson.endTime;

    var daysToBlockStart = this._getDaysBetweenDates(chartStartTime, startTime);
    var daysToBlockEnd = this._getDaysBetweenDates(chartStartTime, endTime);

    var k = 1 / this._chartDuration;

    return {
      leftPx: containerWidth * k * daysToBlockStart + 'px',
      widthPx: containerWidth * k * Math.abs(daysToBlockEnd - daysToBlockStart) + 'px',
      leftPercents: k * daysToBlockStart * 100 + '%',
      widthPercents: k * Math.abs(daysToBlockEnd - daysToBlockStart) * 100 + '%'
    }
  },
  _getNextBlockColor: function () {
    this._currBlockColorIndex = ++this._currBlockColorIndex < blockColors.length ?
                            this._currBlockColorIndex :
                            0;
    return blockColors[this._currBlockColorIndex];
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
