'use strict';

var $ = require('./helper');
var ChartGenerator = require('./chart/chart');
var chartTemplate = require('./constants').chartJsonExample;

var Controller = function () {
  this._chartTarget = null;
  this._chart = null;

  this._scaleSlider = null;
  this._scaleSliderText = null
  this._scaleTextInput = null;
  this._scaleButton = null;

  this._sliderTimeout = null;

  this._init();
};

Controller.prototype = {
  _init: function () {
    this._chartTarget = $.first('.wrapper__content--chart-target')
    this._chart = new ChartGenerator({
      target: this._chartTarget,
      json: chartTemplate,
      timelineInterval: 7,
      scale: 10
    });
    // TODO: remove from global
    window.chart = this._chart;

    this._getElements();
    this._bindEvents();
  },
  _getElements: function () {
    this._scaleSlider = $.first(".controls__panel-scale input[type='range']");
    this._scaleSliderText = $.first(".controls__panel-scale .controls__panel--slider-text");
    this._scaleTextInput = $.first(".controls__panel-scale input[type='text']");
    this._scaleButton = $.first(".controls__panel-scale input[type='button']");
  },
  _bindEvents: function () {
    var self = this;

    this._scaleSlider.addEventListener('input', function () {
      var slider = this;
      self._scaleSliderText.innerHTML = this.value;
      clearTimeout(self._sliderTimeout);
      self._sliderTimeout = setTimeout(function () {
        self._changeChartScale(slider.value);
      }, 500);
    });

    this._scaleButton.addEventListener('click', function () {
      self._changeChartScale(self._scaleTextInput.value);
    });
  },
  _changeChartScale: function (scale) {
    scale = parseInt(scale) || 1;

    this._scaleSliderText.innerHTML = scale;
    this._scaleTextInput.value = scale;
    this._scaleSlider.value = scale;

    this._chart.changeScale(scale);
  }
};

module.exports = Controller;
