'use strict';

var $ = require('../helper');

var BlockTooltip = function (blockElement, blockInfo) {
  this._blockElement = blockElement;
  this._blockInfo = blockInfo;
  this._tooltipElement = null;
};

BlockTooltip.prototype = {
  init: function (blockElement, blockInfo) {
    this._blockElement = blockElement || this._blockElement;
    this._blockInfo = blockInfo || this._blockInfo;
    this._createElement();
    this._setPosition();
    this._appendToBlock();
    this._bind();
  },
  _createElement: function () {
    var tooltip = $.create('div');
    tooltip.classList.add('chart__block--tooltip');
    tooltip.innerHTML = this._blockInfo.name + ', ' +
                        $.formatDate(this._blockInfo.startTime) +
                        ' - ' + $.formatDate(this._blockInfo.endTime);

    this._tooltipElement = tooltip;
  },
  _appendToBlock: function () {
    this._blockElement.appendChild(this._tooltipElement);
  },
  _bind: function () {
    var self = this;
    this._blockElement.addEventListener('mouseover', function (e) {
      self._show();
    });
    this._blockElement.addEventListener('mouseout', function () {
      self._hide();
    });
  },
  _setPosition: function () {
    if (this._blockElement.dataset.parentId == 1) {
      this._tooltipElement.style.bottom = '-80%';
    } else {
      this._tooltipElement.style.top = '-80%';
    }
  },
  _show: function () {
    this._tooltipElement.style.display = 'block';
  },
  _hide: function () {
    this._tooltipElement.style.display = 'none';
  }
};

module.exports = BlockTooltip;
