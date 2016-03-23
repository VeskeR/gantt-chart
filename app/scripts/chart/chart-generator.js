'use strict';

var $ = require('../helper');
var BlockTooltip = require('./block-tooltip');
var blockColors = require('../constants').blockColors;

var ChartGenerator = function (chartTarget, chartJson, timelineInterval) {
  this._chartTarget = chartTarget;
  this._chartJson = chartJson;
  this._timelineInterval = timelineInterval || 7;

  this._chart = null;
  this._pixelsPerInterval = 200;

  this._breakpoints = [];
  this._blockTooltips = [];

  this._currBlockColorIndex = Math.random() * blockColors.length | 0;

  this._controller();
}

ChartGenerator.prototype = {
  _controller: function () {
    this._processChartJson();

    this._chartDuration = this._chartDuration ||
                          this._getDaysBetweenDates(
                            this._chartJson.startTime,
                            this._chartJson.endTime
                          );

    this._renderChart();
  },
  _renderChart: function (chartTarget, chartJson, timelineInterval) {
    this._chartTarget = chartTarget || this._chartTarget;
    this._chartJson = chartJson || this._chartJson;
    this._timelineInterval = timelineInterval || this._timelineInterval;

    this._createChart();
    this._setChartWidth();
    this._appendChartToTarget();
    this._setBlockPositions();
    this._setBreakpointPositions();
    this._setBreakpointPipeSizes();
    this._colorizeBlocks();
    this._createTooltips();
    this._bindEvents();
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
    var $chart = $.create('div');

    $chart.classList.add('chart');

    var $chartHeader = this._createChartHeader();
    var $chartBody = this._createChartBody();

    $chart.appendChild($chartHeader);
    $chart.appendChild($chartBody);

    this._chart = $chart;
  },
  _createChartHeader: function () {
    var self = this;

    var $chartHeader = $.create('div');
    $chartHeader.classList.add('chart__header');

    this._chartJson.rows.forEach(function (row) {
      var $caption = self._createCaption(row);
      $chartHeader.appendChild($caption);
    });

    return $chartHeader;
  },
  _createCaption: function (row) {
    var $caption = $.create('div');

    $caption.innerHTML = row.name;
    $caption.classList.add('chart__header--caption');
    $caption.classList.add('chart__cell');

    return $caption;
  },
  _createChartBody: function () {
    var self = this;

    var $chartBody = $.create('div');
    $chartBody.classList.add('chart__body');

    this._chartJson.rows.forEach(function (row) {
      var $blocksContainer = self._createBlocksContainer(row);
      $chartBody.appendChild($blocksContainer);
    });

    var $timeline = this._createTimeline();
    $chartBody.appendChild($timeline);

    return $chartBody;
  },
  _createBlocksContainer: function (row) {
    var $blocksContainer = $.create('div');

    $blocksContainer.classList.add('chart__body--blocks-container');
    $blocksContainer.classList.add('chart__cell');

    var $blocksContainerWrapper = this._createBlocksContainerWrapper(row);
    $blocksContainer.appendChild($blocksContainerWrapper);

    return $blocksContainer;
  },
  _createBlocksContainerWrapper: function (row) {
    var self = this;

    var $blocksContainerWrapper = $.create('div');
    $blocksContainerWrapper.classList.add('chart__body--blocks-container--wrapper');

    row.blocks.forEach(function (block) {
      var $block = self._createBlock(block);
      $blocksContainerWrapper.appendChild($block);
    });

    return $blocksContainerWrapper;
  },
  _createBlock: function (block) {
    var $block = $.create('div');
    $block.classList.add('chart__block');
    return $block;
  },
  _createTimeline: function () {

    var $timeline = $.create('div');
    $timeline.classList.add('chart__body--timeline');

    var $timelineWrapper = this._createTimelineWrapper();
    $timeline.appendChild($timelineWrapper);

    return $timeline;
  },
  _createTimelineWrapper: function () {
    var self = this;

    var $timelineWrapper = $.create('div');
    $timelineWrapper.classList.add('chart__body--timeline--wrapper');

    var breakpointsCount = this._getBreakpointsCount();
    this._breakpoints = this._getBreakpoints(breakpointsCount);

    this._breakpoints.forEach(function (breakpoint) {
      var $breakpoint = self._createBreakpoint(breakpoint);
      $timelineWrapper.appendChild($breakpoint);
    });

    return $timelineWrapper;
  },
  _getBreakpointsCount: function () {
    return Math.round(this._getInvervalCount()) + 1;
  },
  _getInvervalCount: function () {
    return this._chartDuration / this._timelineInterval;
  },
  _getBreakpoints: function (count) {
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

    $breakpoint.classList.add('chart__breakpoint');
    $breakpoint.innerHTML = breakpoint.toLocaleDateString();

    var $pipe = this._createBreakpointPipe();
    $breakpoint.appendChild($pipe);

    return $breakpoint;
  },
  _createBreakpointPipe: function () {
    var $pipe = $.create('div');
    $pipe.classList.add('chart__breakpoint--pipe');
    return $pipe;
  },
  _setChartWidth: function () {
    var self = this;

    var intervalCount = this._getInvervalCount();
    var chartWidth = self._pixelsPerInterval * intervalCount + 'px';
    var $blocksContainer = this._chart.querySelectorAll('.chart__body--blocks-container');
    var $timeline = this._chart.querySelector('.chart__body--timeline');

    Array.prototype.forEach.call($blocksContainer, function ($blockContainter) {
      $blockContainter.style.width = chartWidth;
    });

    $timeline.style.width = chartWidth;
  },
  _appendChartToTarget: function () {
    var $wrapper = $.create('div');
    $wrapper.classList.add('wrapper');
    $wrapper.appendChild(this._chart);

    this._chartTarget.appendChild($wrapper);
  },
  _setBlockPositions: function () {
    for (var i = 0; i < this._chartJson.rows.length; i++) {
      var row = this._chartJson.rows[i];
      var $blocksContainer = this._chart.querySelectorAll('.chart__body--blocks-container')[i];
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
  _setBreakpointPositions: function () {
    var $chartTimeline = this._chart.querySelector('.chart__body--timeline--wrapper');
    var $breakpoints = $chartTimeline.querySelectorAll('.chart__breakpoint');
    var containerWidth = $.compStyles($chartTimeline).width;

    for (var i = 0; i < this._breakpoints.length; i++) {
      var breakpoint = this._breakpoints[i];
      var $breakpoint = $breakpoints[i];

      var breakpointPositionInfo = this._getRelativePositionInfo(
        breakpoint,
        breakpoint,
        containerWidth
      );

      $breakpoint.style.left = breakpointPositionInfo.leftPercents;
    }
  },
  _setBreakpointPipeSizes: function () {
    var $pipes = this._chart.querySelectorAll('.chart__breakpoint--pipe');

    var $bodyHeight = this._chart.querySelector('.chart__body');
    var $timelineHeight = this._chart.querySelector('.chart__body--timeline');
    var chartBlocksHeight = parseInt($.compStyles($bodyHeight).height) -
                            parseInt($.compStyles($timelineHeight).height);

    Array.prototype.forEach.call($pipes, function ($pipe) {
      $pipe.style.height = chartBlocksHeight + 'px';
      $pipe.style.top = '-' + chartBlocksHeight + 'px';
    });
  },
  _colorizeBlocks: function () {
    var self = this;

    var blocks = this._chart.querySelectorAll('.chart__block');
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
      var $blocksContainer = this._chart.querySelectorAll('.chart__body--blocks-container--wrapper')[i];
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
  }
};

module.exports = ChartGenerator;
