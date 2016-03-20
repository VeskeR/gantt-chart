var $ = require('./query-selector');
var generateChartHtml = require('./generate-chart-html');

var ChartGenerator = function (chartTarget, chartJson) {
  this._chartTarget = chartTarget;
  this._chartJson = chartJson;
  this._chartHtml;
}

ChartGenerator.prototype = {
  renderChart: function (chartJson, chartTarget) {
    chartJson = chartJson || this._chartJson;
    chartTarget = chartTarget || this._chartTarget;

    var chartHtml = this.createChartHtml(chartJson);
    this.appendChartToTarget(chartHtml, chartTarget);
  },
  createChartHtml: function (chartJson) {
    chartJson = chartJson || this._chartJson;

    this._chartHtml = generateChartHtml(chartJson);
    return this._chartHtml;
  },
  appendChartToTarget: function (chartHtml, chartTarget) {
    chartHtml = chartHtml || this._chartHtml;
    chartTarget = chartTarget || this._chartTarget;

    chartTarget.appendChild(chartHtml);
  }
}

module.exports = ChartGenerator;
