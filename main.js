requirejs(['config.js'], function() {
  require(['makeChart', 'domready!'], function(makeChart) {
    require(['fetchTimeData'], function(fetchTimeData) {
      makeChart({
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
      }, function(timeChart) {
        return fetchTimeData.then(function(data) {
          timeChart.addSeries({
            name: 'Completion time',
            data: data.times,
          });
          timeChart.get('xAxis').setCategories(data.labels);
          timeChart.hideLoading();
        });
      });
    });

    require(['fetchDomainData'], function(fetchDomainData) {
      makeChart({
        chart: {
          renderTo: 'domain-chart',
          type: 'pie'
        },
        title: {text: 'Profile Websites'},
        subtitle: {text: 'Websites users chose to link to as their profiles'},
        legend: {enabled: false}
      }, function(domainChart) {
        return fetchDomainData.then(function(data) {
          domainChart.addSeries({
            name: 'Number of people who linked to profiles on this site',
            data: data
          });
        });
      });
    });

    require(['fetchLanguageData'], function(fetchLanguageData) {
      makeChart({
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
      }, function(languageChart) {
        return fetchLanguageData.then(function(data) {
          languageChart.addSeries({
            name: 'Number of people using this language to solve puzzles',
            data: data.data
          });
        });
      });
    });
  });
});
