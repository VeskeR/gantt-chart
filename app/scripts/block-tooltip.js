'use strict';

var $ = require('./query-selector');

var BlockTooltip = function (blockElement, blockInfo) {
  this._blockElement = blockElement;
  this._blockInfo = blockInfo;
};

BlockTooltip.prototype = {
  init: function (blockElement, blockInfo) {
    this._blockElement = blockElement || this._blockElement;
    this._blockInfo = blockInfo || this._blockInfo;
  }
};

module.exports = BlockTooltip;
