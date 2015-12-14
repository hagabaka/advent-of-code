define(['highcharts'], function(HighCharts) {
  return function(chartOptions, addData) {
    var chart = new HighCharts.Chart(chartOptions);
    chart.showLoading('Loading data...');
    addData(chart).then(function() {
      chart.hideLoading();
    }).catch(function(error) {
      chart.showLoading('Failed to load Data!');
      throw error;
    });
  };
});
