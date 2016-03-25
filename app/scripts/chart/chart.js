'use strict';

var $ = require('../helper');
var BlocksTooltip = require('./blocks-tooltip');
var blockColors = require('../constants').blockColors;

var Chart = function (settings) {
  this._chartTarget = settings.target;
  this._chartJson = settings.json;
  this._timelineInterval = settings.timelineInterval || 7;
  this._chartScale = settings.scale || 1;

  this._chartInfo = null;
  this._chart = null;
  this._chartHeader = null;
  this._chartBody = null;
  this._chartTimeline = null;

  this._minTimelineInterval = 1;
  this._maxTimelineInterval = 30;

  this._pixelsPerScale = 100;

  this._minChartScale = 1;
  this._maxChartScale = 1000;

  this._flattenedBlockInfos = [];
  this._flattenedCaptions = [];
  this._flattenedBlocksContainers = [];
  this._flattenedBlocks = [];

  this._breakpoints = [];
  this._blocksTooltip = null;

  this._colorCache = {};
  this._currBlockColorIndex = Math.random() * blockColors.length | 0;

  this._controller();
}

Chart.prototype = {
  changeScale: function (newScale) {
    if (newScale < this._minChartScale) {
      newScale = this._minChartScale;
    } else if (newScale > this._maxChartScale) {
      newScale = this._maxChartScale;
    }

    this._chartScale = newScale;

    // We need to recalculate elements widths
    // Since blocks and timeline breakpoints uses percents to position themselves
    // we do not need to recalculate them too
    this._setChartBodyElementsWidth();
  },
  changeTimelineInterval: function (newInterval) {
    if (newInterval < this._minTimelineInterval) {
      newInterval = this._minTimelineInterval;
    } else if (newInterval > this._maxTimelineInterval) {
      newInterval = this._maxTimelineInterval;
    }

    this._timelineInterval = newInterval;

    this._destroyTimeline();

    var $newTimeline = this._createTimeline();
    this._chartTimeline = $newTimeline;
    this._chartBody.appendChild($newTimeline);

    this._setChartBodyElementsWidth();

    this._setBreakpointPositions();
    this._setBreakpointPipeSizes();
  },
  _controller: function () {
    var self = this;

    this._processChartJson();
    this._traverseChartInfoInOrder(function (infoBlock) {
      self._flattenedBlockInfos[infoBlock.id] = infoBlock;
    });
    this._renderChart();
  },
  _processChartJson: function () {
    var self = this;

    var id = 0;
    var level = -1;

    var chartStartTime = new Date(this._chartJson.startTime);
    var chartEndTime = new Date(this._chartJson.endTime);

    var processBlock = function (block) {
      level++;
      var processedBlock = {};

      processedBlock.id = id++;
      processedBlock.level = level;

      processedBlock.name = block.name || '';
      processedBlock.startTime = new Date(block.startTime);
      processedBlock.endTime = new Date(block.endTime);
      processedBlock.fromBeginning = self._getDaysBetweenDates(chartStartTime, processedBlock.startTime);
      processedBlock.toEnd = self._getDaysBetweenDates(processedBlock.endTime, chartEndTime);
      processedBlock.duration = self._getDaysBetweenDates(processedBlock.startTime, processedBlock.endTime);
      processedBlock.blocks = [];

      if (block.blocks && block.blocks.length > 0) {
        for (var i = 0; i < block.blocks.length; i++) {
          processedBlock.blocks.push(processBlock(block.blocks[i]));
        }
      }

      level--;
      return processedBlock;
    };

    this._chartInfo = processBlock(this._chartJson);
  },
  _renderChart: function () {
    // Creation of chart layout
    this._createChart();
    this._setChartBodyElementsWidth();

    // Appending created chart layout to specified target in DOM
    this._appendChartToTarget();

    // Configuring chart element positions and sizes
    this._setBlockPositions();
    this._setBreakpointPositions();
    this._setBreakpointPipeSizes();

    // Apply styling
    this._markEveryOtherVisibleRow();
    this._colorizeBlocks();

    // Creating tooltips for blocks
    this._createTooltips();

    // Adding event listeners to response user input
    this._bindEvents();
  },
  _createChart: function () {
    var $chart = $.create('div');

    $chart.classList.add('chart');

    var $chartHeader = this._createChartHeader();
    var $chartBody = this._createChartBody();

    this._chartHeader = $chartHeader;
    this._chartBody = $chartBody;

    $chart.appendChild($chartHeader);
    $chart.appendChild($chartBody);

    this._chart = $chart;
  },
  _createChartHeader: function () {
    var self = this;

    var $chartHeader = $.create('div');
    $chartHeader.classList.add('chart__header');

    var buildCaptions = function (blocks) {
      blocks.forEach(function (block) {
        var isGroup = block.blocks && block.blocks.length > 0;

        var $caption = self._createCaption(block, isGroup);
        $chartHeader.appendChild($caption);

        self._flattenedCaptions[block.id] = $caption;

        if (isGroup) {
          buildCaptions(block.blocks);
        }
      });
    };

    buildCaptions(this._chartInfo.blocks);

    return $chartHeader;
  },
  _createCaption: function (block, isGroup) {
    var $caption = $.create('div');

    $caption.classList.add('chart__header--caption');
    $caption.classList.add('chart__cell');
    $caption.classList.add(block.level < 2 ? 'visible' : 'hidden');

    $caption.dataset.blockId = block.id;

    if (isGroup) {
      var $captionGroupExpander = $.create('div');
      $captionGroupExpander.classList.add('group-expander');

      var $arrow = $.create('div');
      $arrow.classList.add('group-expander__arrow');
      $arrow.classList.add('group-expander__arrow--collapsed');
      $captionGroupExpander.appendChild($arrow);

      $caption.appendChild($captionGroupExpander);
    }

    var $captionText = $.create('p');
    $captionText.innerHTML = block.name;
    $captionText.classList.add('chart__header--caption--text');

    $caption.appendChild($captionText);

    return $caption;
  },
  _createChartBody: function () {
    var self = this;

    var $chartBody = $.create('div');
    $chartBody.classList.add('chart__body');

    var buildBlocksContainers = function (blocks) {
      blocks.forEach(function (block) {
        var isGroup = block.blocks && block.blocks.length > 0;

        var $blocksContainer = self._createBlocksContainer(block, isGroup);
        $chartBody.appendChild($blocksContainer);

        self._flattenedBlocksContainers[block.id] = $blocksContainer;

        if (isGroup) {
          buildBlocksContainers(block.blocks);
        }
      });
    };

    buildBlocksContainers(this._chartInfo.blocks);

    var $timeline = this._createTimeline();
    this._chartTimeline = $timeline;
    $chartBody.appendChild($timeline);

    return $chartBody;
  },
  _createBlocksContainer: function (block, isGroup) {
    var self = this;

    var $blocksContainer = $.create('div');

    $blocksContainer.classList.add('chart__body--blocks-container');
    $blocksContainer.classList.add('chart__cell');
    $blocksContainer.classList.add('collapsed');
    $blocksContainer.classList.add(block.level < 2 ? 'visible' : 'hidden');
    if (isGroup) {
      $blocksContainer.classList.add('chart__body--blocks-container-group');
    }

    $blocksContainer.dataset.blockId = block.id;

    var $blocksContainerWrapper = $.create('div');
    $blocksContainerWrapper.classList.add('chart__body--blocks-container--wrapper');

    var $block = self._createBlock(block, block);
    $blocksContainerWrapper.appendChild($block);
    this._flattenedBlocks.push($block);

    if (isGroup) {
      block.blocks.forEach(function (innerBlock) {
        var $innerBlock = self._createBlock(innerBlock, block);
        $blocksContainerWrapper.appendChild($innerBlock);
        self._flattenedBlocks.push($innerBlock);
      });
    }

    $blocksContainer.appendChild($blocksContainerWrapper);

    return $blocksContainer;
  },
  _createBlock: function (blockInfo, blockParentInfo) {
    var $block = $.create('div');
    $block.classList.add('chart__block');
    $block.dataset.blockId = blockInfo.id;
    $block.dataset.parentId = blockParentInfo.id;
    $block.classList.add(blockInfo.id === blockParentInfo.id ? 'chart__block--own' : 'chart__block--child');

    var $blockText = $.create('p');
    $blockText.classList.add('chart__block--text');
    $blockText.innerHTML = blockInfo.name;

    $block.appendChild($blockText);

    return $block;
  },
  _createTimeline: function () {
    var self = this;

    var $timeline = $.create('div');
    $timeline.classList.add('chart__body--timeline');

    var $timelineWrapper = $.create('div');
    $timelineWrapper.classList.add('chart__body--timeline--wrapper');

    var breakpointsCount = this._getBreakpointsCount();
    this._breakpoints = this._getBreakpoints(breakpointsCount);

    this._breakpoints.forEach(function (breakpoint) {
      var $breakpoint = self._createBreakpoint(breakpoint);
      $timelineWrapper.appendChild($breakpoint);
    });

    $timeline.appendChild($timelineWrapper);

    return $timeline;
  },
  _destroyTimeline: function () {
    if (this._chartTimeline) {
      this._chartBody.removeChild(this._chartTimeline);
    }
    this._chartTimeline = null;
    this._breakpoints = [];
  },
  _getBreakpointsCount: function () {
    return Math.round(this._getInvervalCount()) + 1;
  },
  _getInvervalCount: function () {
    return this._chartInfo.duration / this._timelineInterval;
  },
  _getBreakpoints: function (count) {
    var breakpoints = [];
    var currBreakpointDate = new Date(this._chartInfo.startTime);

    for (var i = 0; i < count; i++) {
      if (currBreakpointDate > this._chartInfo.endTime) {
        currBreakpointDate = new Date(this._chartInfo.endTime);
      }
      breakpoints.push(new Date(currBreakpointDate));
      currBreakpointDate.setDate(currBreakpointDate.getDate() + this._timelineInterval);
    }

    return breakpoints;
  },
  _createBreakpoint: function (breakpoint) {
    var $breakpoint = $.create('div');

    $breakpoint.classList.add('chart__breakpoint');
    $breakpoint.innerHTML = $.formatDate(breakpoint);

    var $pipe = this._createBreakpointPipe();
    $breakpoint.appendChild($pipe);

    return $breakpoint;
  },
  _createBreakpointPipe: function () {
    var $pipe = $.create('div');
    $pipe.classList.add('chart__breakpoint--pipe');
    return $pipe;
  },
  _setChartBodyElementsWidth: function () {
    var self = this;

    var chartBodyWidth = this._getChartBodyElementsWidth();

    this._flattenedBlocksContainers.forEach(function (blocksContainer) {
      blocksContainer.style.width = chartBodyWidth;
    });

    this._chartTimeline.style.width = chartBodyWidth;
  },
  _getChartBodyElementsWidth: function () {
    var intervalCount = this._getInvervalCount();
    return this._pixelsPerScale * this._chartScale + 'px';
  },
  _appendChartToTarget: function () {
    var $wrapper = $.create('div');
    $wrapper.classList.add('chart-wrapper');
    $wrapper.appendChild(this._chart);

    this._chartTarget.appendChild($wrapper);
  },
  _setBlockPositions: function () {
    var self = this;
    this._flattenedBlocks.forEach(function ($block) {
      var $blocksContainer = self._flattenedBlocksContainers[$block.dataset.parentId];
      var containerWidth = $.compStyles($blocksContainer).width;
      var blockInfo = self._flattenedBlockInfos[$block.dataset.blockId];
      var blockPositionInfo = self._getRelativePositionInfo(
        blockInfo.startTime,
        blockInfo.endTime,
        containerWidth
      );
      $block.style.width = blockPositionInfo.widthPercents;
      $block.style.left = blockPositionInfo.leftPercents;
    });
  },
  _setBreakpointPositions: function () {
    var $breakpoints = this._chartTimeline.querySelectorAll('.chart__breakpoint');
    var containerWidth = $.compStyles(this._chartTimeline).width;

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
    var chartBlocksHeight = parseInt($.compStyles(this._chartBody).height) -
                            parseInt($.compStyles(this._chartTimeline).height);

    // Need to multiply pipe height in case of blocks height change
    chartBlocksHeight *= 1 + this._flattenedBlocksContainers.length;

    Array.prototype.forEach.call($pipes, function ($pipe) {
      $pipe.style.height = chartBlocksHeight + 'px';
      $pipe.style.top = '-' + chartBlocksHeight + 'px';
    });
  },
  _markEveryOtherVisibleRow: function () {
    this._flattenedCaptions.forEach(function (caption) {
      caption.classList.remove('second-cell');
    });
    this._flattenedBlocksContainers.forEach(function (blocksContainer) {
      blocksContainer.classList.remove('second-cell');
    });

    var visibleCaptions = this._chartHeader.querySelectorAll('.chart__header--caption.visible');
    var visibleBlocksContainers = this._chartBody.querySelectorAll('.chart__body--blocks-container.visible');

    for (var i = 0; i < visibleCaptions.length; i++) {
      if (i % 2 == 1) {
        visibleCaptions[i].classList.add('second-cell');
        visibleBlocksContainers[i].classList.add('second-cell');
      }
    }
  },
  _colorizeBlocks: function () {
    var self = this;
    this._flattenedBlocks.forEach(function (block) {
      block.style.backgroundColor = self._getCachedBlockColor(block.dataset.blockId);
    });
  },
  _createTooltips: function () {
    this._blocksTooltip = new BlocksTooltip(this._chartBody, this._flattenedBlocks, this._flattenedBlockInfos);
    this._blocksTooltip.init();
  },
  _bindEvents: function () {
    var self = this;

    this._flattenedCaptions.forEach(function (caption) {
      var $expanderArrow = caption.querySelector('.group-expander__arrow');
      if ($expanderArrow) {
        $expanderArrow.addEventListener('click', function () {
          if (this.classList.contains('group-expander__arrow--collapsed')) {
            self._expandBlock(caption.dataset.blockId);
          } else {
            self._collapseBlock(caption.dataset.blockId);
          }
        });
      }
    });
  },
  _expandBlock: function (blockId) {
    var self = this;
    var $caption = this._flattenedCaptions[blockId];
    var $expanderArrow = $caption.querySelector('.group-expander__arrow');

    $expanderArrow.classList.remove('group-expander__arrow--collapsed');
    $expanderArrow.classList.add('group-expander__arrow--expanded');

    var $parentBlockContainer = this._flattenedBlocksContainers[blockId];

    $parentBlockContainer.classList.remove('collapsed');
    $parentBlockContainer.classList.add('expanded');

    this._flattenedBlockInfos[blockId].blocks.forEach(function (blockInfo) {
      var $innerCaption = self._flattenedCaptions[blockInfo.id];
      var $innerBlockContainer = self._flattenedBlocksContainers[blockInfo.id];
      $innerCaption.classList.remove('hidden');
      $innerCaption.classList.add('visible');

      $innerBlockContainer.classList.remove('hidden');
      $innerBlockContainer.classList.add('visible');
    });

    this._markEveryOtherVisibleRow();
  },
  _collapseBlock: function (blockId) {
    var self = this;
    var $caption = this._flattenedCaptions[blockId];
    var $expanderArrow = $caption.querySelector('.group-expander__arrow');

    $expanderArrow.classList.remove('group-expander__arrow--expanded');
    $expanderArrow.classList.add('group-expander__arrow--collapsed');

    var $parentBlockContainer = this._flattenedBlocksContainers[blockId];

    $parentBlockContainer.classList.add('collapsed');
    $parentBlockContainer.classList.remove('expanded');

    this._flattenedBlockInfos[blockId].blocks.forEach(function (blockInfo) {
      if (blockInfo.blocks && blockInfo.blocks.length > 0) {
        self._collapseBlock(blockInfo.id);
      }

      var $innerCaption = self._flattenedCaptions[blockInfo.id];
      var $innerBlockContainer = self._flattenedBlocksContainers[blockInfo.id];
      $innerCaption.classList.remove('visible');
      $innerCaption.classList.add('hidden');

      $innerBlockContainer.classList.remove('visible');
      $innerBlockContainer.classList.add('hidden');
    });

    this._markEveryOtherVisibleRow();
  },
  _getCachedBlockColor: function (blockId) {
    if (!this._colorCache[blockId]) {
      this._colorCache[blockId] = this._getNextBlockColor();
    }
    return this._colorCache[blockId];
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
  _getDaysBetweenDates: function (firstDate, secondDate) {
    firstDate = firstDate || new Date(0);
    secondDate = secondDate || new Date(0);

    var diff = Math.abs(firstDate.getTime() - secondDate.getTime());
    var daysDiff = Math.ceil(diff / 1000 / 60 / 60 / 24);

    return daysDiff;
  },
  _traverseChartInfoInOrder: function (callback) {
    var traverse = function (blocks) {
      blocks.forEach(function (block) {
        callback(block);
        if (block.blocks && block.blocks.length > 0) {
          traverse(block.blocks);
        }
      });
    }

    traverse(this._chartInfo.blocks);
  },
  _traverseChartInfoLevelOrder: function (callback) {
    var queue = [];
    Array.prototype.push.apply(queue, this._chartInfo.blocks);

    while (queue.length > 0) {
      var block = queue.shift();
      callback(block);
      if (block.blocks && block.blocks.length > 0) {
        Array.prototype.push.apply(queue, block.blocks);
      }
    }
  },
  _getRelativePositionInfo: function (startTime, endTime, containerWidth) {
    startTime = startTime || new Date(0);
    endTime = endTime || new Date(0);
    containerWidth = parseInt(containerWidth) || 0;

    var chartStartTime = this._chartInfo.startTime;
    var chartEndTime = this._chartInfo.endTime;

    var daysToBlockStart = this._getDaysBetweenDates(chartStartTime, startTime);
    var daysToBlockEnd = this._getDaysBetweenDates(chartStartTime, endTime);

    var k = 1 / this._chartInfo.duration;

    return {
      leftPx: containerWidth * k * daysToBlockStart + 'px',
      widthPx: containerWidth * k * Math.abs(daysToBlockEnd - daysToBlockStart) + 'px',
      leftPercents: k * daysToBlockStart * 100 + '%',
      widthPercents: k * Math.abs(daysToBlockEnd - daysToBlockStart) * 100 + '%'
    }
  }
};

module.exports = Chart;
