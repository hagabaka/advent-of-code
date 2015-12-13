requirejs(['config.js'], function() {
  var loadingText = 'Loading Data...';
  require(['highcharts'], function(Highcharts) {
    require(['domready!'], function() {
      var timeChart = new Highcharts.Chart({
        chart: {
          renderTo: 'time-chart',
          type: 'bar'
        },
        title: {text: 'Completion Times'},
        subtitle: {text: 'Durations between midnight and listed times'},
        tooltip: {
          formatter: function() {
            var totalSeconds = this.y / 1000;
            var seconds = totalSeconds % 60;
            var totalMinutes = (totalSeconds - seconds) / 60;
            var minutes = totalMinutes % 60;
            return this.x + ': <strong>' + minutes + ' minutes ' + seconds + ' seconds</strong>'; 
          },
          followPointer: true
        },
        xAxis: {
          type: 'categories',
          labels: {useHTML: true},
          id: 'xAxis'
        },
        yAxis: {
          type: 'datetime',
          title: {
            text: 'Time from midnight to completion'
          },
          units: [['second', [120]]],
          showFirstLabel: false
        },
        data: {dateFormat: 'mm:ss'},
        legend: {enabled: false}
      });
      timeChart.showLoading(loadingText);
      require(['fetchTimeData'], function(fetchTimeData) {
        fetchTimeData.then(function(data) {
          timeChart.addSeries({
            name: 'Completion time',
            data: data.times,
          });
          timeChart.get('xAxis').setCategories(data.labels);
          timeChart.hideLoading();
        });
      });

      var domainChart = new Highcharts.Chart({
        chart: {
          renderTo: 'domain-chart',
          type: 'pie'
        },
        title: {text: 'Profile Websites'},
        subtitle: {text: 'Websites users chose to link to as their profiles'},
        legend: {enabled: false}
      });
      domainChart.showLoading(loadingText);
      require(['fetchDomainData'], function(fetchDomainData) {
        fetchDomainData.then(function(data) {
          domainChart.addSeries({
            name: 'Number of people who linked to profiles on this site',
            data: data
          });
          domainChart.hideLoading();
        });
      });
    });

    var languageChart = new Highcharts.Chart({
      chart: {
        renderTo: 'language-chart',
        type: 'pie'
      },
      title: {text: 'Used Languages'},
      subtitle: {
        text: 'Based on GitHub search of "advent" repositories under listed users',
        useHTML: true
      },
      legend: {enabled: false},
    });
    languageChart.showLoading(loadingText);
    require(['fetchLanguageData'], function(fetchLanguageData) {
      fetchLanguageData.then(function(data) {
        languageChart.addSeries({
          name: 'Number of people using this language to solve puzzles',
          data: data.data
        });
        languageChart.hideLoading();
      });
    });
  });
});
