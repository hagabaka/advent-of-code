requirejs(['config.js'], function() {
  require(['highcharts'], function(Highcharts) {
    require(['fetchTimeData'], function(fetchTimeData) {
      fetchTimeData.then(function(data) {
        require(['domready!'], function() {
          new Highcharts.Chart({
            chart: {
              renderTo: 'time-chart',
              type: 'bar'
            },
            title: {text: 'Completion Times'},
            subtitle: {text: 'Durations between midnight and listed times'},
            series: [{
              name: 'Completion time',
              data: data.times,
            }],
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
              categories: data.labels,
              labels: {useHTML: true},
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
        });
      });
    });

    require(['fetchDomainData'], function(fetchDomainData) {
      fetchDomainData.then(function(data) {
        new Highcharts.Chart({
          chart: {
            renderTo: 'domain-chart',
            type: 'pie'
          },
          title: {text: 'Profile Websites'},
          subtitle: {text: 'Websites users chose to link to as their profiles'},
          legend: {enabled: false},
          series: [{
            name: 'Number of people who linked to profiles on this site',
            data: data
          }]
        });
      });
    });

    require(['fetchLanguageData'], function(fetchLanguageData) {
      fetchLanguageData.then(function(data) {
        new Highcharts.Chart({
          chart: {
            renderTo: 'language-chart',
            type: 'pie'
          },
          title: {text: 'Used Languages'},
          subtitle: {
            text: 'Based on GitHub <a href="' + data.sourceUrl + '">search</a> of "advent" repositories under listed users',
            useHTML: true
          },
          legend: {enabled: false},
          series: [{
            name: 'Number of people using this language to solve puzzles',
            data: data.data
          }]
        });
      });
    });
  });
});
