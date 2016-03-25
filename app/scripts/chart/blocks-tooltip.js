'use strict';

var $ = require('../helper');

var BlocksTooltip = function (chartBody, flattenedBlocks, flattenedBlockInfos) {
  this._chartBody = chartBody;
  this._flattenedBlocks = flattenedBlocks;
  this._flattenedBlockInfos = flattenedBlockInfos;
  this._tooltip = null;
};

BlocksTooltip.prototype = {
  init: function () {
    this._createTooltip();
    this._appendToBody();
    this._bindEvents();
  },
  _createTooltip: function () {
    var tooltip = $.create('div');
    tooltip.classList.add('chart__body--tooltip');
    this._tooltip = tooltip;
  },
  _appendToBody: function () {
    this._chartBody.appendChild(this._tooltip);
  },
  _bindEvents: function () {
    var self = this;
    this._flattenedBlocks.forEach(function (block) {
      block.addEventListener('mouseover', function (e) {
        self._showTooltipFor(block);
      });
      block.addEventListener('mouseout', function () {
        self._hide();
      });
    });
  },
  _showTooltipFor: function (block) {
    this._setContent(block.dataset.blockId);
    this._setPosition(block);

    this._tooltip.style.display = 'block';
  },
  _hide: function () {
    this._tooltip.style.display = 'none';
  },
  _setContent: function (blockId) {
    var blockInfo = this._flattenedBlockInfos[blockId];
    this._tooltip.innerHTML = blockInfo.name + ', ' +
                        $.formatDate(blockInfo.startTime) +
                        ' - ' + $.formatDate(blockInfo.endTime);
  },
  _setPosition: function (block) {
    var blockWidth = parseFloat($.compStyles(block).width);
    var blockHeight = parseFloat($.compStyles(block).height)
    var blockLeft = parseFloat($.compStyles(block).left);
    var offsetTop = parseFloat(block.parentElement.offsetTop) +
                    parseFloat(block.parentElement.parentElement.offsetTop);

    var tooltipLeft = (blockLeft + 40 + blockWidth / 10) + 'px';

    this._tooltip.style.left = tooltipLeft;
    if (block.dataset.parentId == 1) {
      this._tooltip.style.top = (offsetTop + blockHeight * 0.8)  + 'px';
    } else {
      this._tooltip.style.top = (offsetTop - blockHeight * 0.8)  + 'px';
    }
  }
};

module.exports = BlocksTooltip;
