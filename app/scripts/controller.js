'use strict';

var $ = require('./helper');
var ChartGenerator = require('./chart/chart');

var Controller = function () {
  this._chartTarget = null;
  this._chartInfo = null;
  this._chart = null;

  this._scaleSlider = null;
  this._scaleSliderText = null
  this._scaleTextInput = null;
  this._scaleButton = null;

  this._intervalTextInput = null;
  this._intervalButton = null;

  this._sliderTimeout = null;

  this._init();
};

Controller.prototype = {
  _init: function () {
    var self = this;
    this._chartTarget = $.first('.wrapper__content--chart-target');

    try {
      this._loadJson('scripts/chart.json', function (response) {
        try {
          self._chartInfo = JSON.parse(response);
        } catch (e) {
          console.warn('Unable to parse chart.json. Error: ' + e);
        } finally {
          self._createChart();
        }
      });
    } catch (e) {
      console.warn('Failed loading chart.json. Error: ' + e);
    }
  },
  _createChart: function () {
    if (this._chartInfo !== null) {
      try {
        this._chart = new ChartGenerator({
          target: this._chartTarget,
          info: this._chartInfo,
          timelineInterval: 7,
          scale: 10
        });
      } catch (e) {
        console.warn('Error occurred while creating chart: ' + e);
        this._chart = null;
      }
    } else {
      console.warn('No valid chart information found. Not creating chart.');
    }

    this._getElements();
    this._bindEvents();
  },
  _loadJson: function (file, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true);
    xobj.onreadystatechange = function() {
      if (xobj.readyState == 4 && xobj.status == "200") {
        callback(xobj.responseText);
      }
    }
    xobj.send(null);
  },
  _getElements: function () {
    this._scaleSlider = $.first(".controls__panel-scale input[type='range']");
    this._scaleSliderText = $.first(".controls__panel-scale .controls__panel--slider-text");
    this._scaleTextInput = $.first(".controls__panel-scale input[type='text']");
    this._scaleButton = $.first(".controls__panel-scale button");

    this._intervalTextInput = $.first(".controls__panel-timeline-interval input[type='text']")
    this._intervalButton = $.first(".controls__panel-timeline-interval button");
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

    this._intervalButton.addEventListener('click', function () {
      self._changeInterval(self._intervalTextInput.value);
    });
  },
  _changeChartScale: function (scale) {
    scale = parseInt(scale) || 1;

    this._scaleSliderText.innerHTML = scale;
    this._scaleTextInput.value = scale;
    this._scaleSlider.value = scale;

    if (this._chart) {
      this._chart.changeScale(scale);
    }
  },
  _changeInterval: function (intervalCount) {
    intervalCount = parseInt(intervalCount) || 1;

    this._intervalTextInput.value = intervalCount;

    if (this._chart) {
      this._chart.changeTimelineInterval(intervalCount);
    }
  }
};

module.exports = Controller;
