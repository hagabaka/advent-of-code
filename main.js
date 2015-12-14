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
            return this.x + ' (' + this.series.name + '): <strong>' + minutes + ' minutes ' + seconds + ' seconds</strong>'; 
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
        data: {dateFormat: 'mm:ss'}
      }, function(timeChart) {
        return fetchTimeData.then(function(data) {
          data.forEach(function(day) {
            timeChart.addSeries({
              name: day.date,
              data: day.times,
            });
          });
          timeChart.get('xAxis').setCategories(data[0].labels);
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
        legend: {enabled: true}
      }, function(domainChart) {
        return fetchDomainData.then(function(data) {
          data.forEach(function(day, index) {
            var centerX = (index * 2 + 1) / (data.length * 2) * 100 + '%';
            var centerY = '50%';
            domainChart.addSeries({
              name: day.date,
              data: day.data,
              dataLabels: {useHTML: true},
              center: [centerX, centerY],
              title: {
                text: day.date,
                verticalAlign: 'top',
                align: 'center',
                y: -50
              }
            });
          });
        });
      });
    });

    require(['fetchLanguageData'], function(fetchLanguageData) {
      var anchorText = 'GitHub search';
      makeChart({
        chart: {
          renderTo: 'language-chart',
          type: 'pie'
        },
        title: {text: 'Used Languages'},
        subtitle: {
          text: 'Based on ' + anchorText + ' of "advent" repositories under listed users',
          useHTML: true
        },
      }, function(languageChart) {
        return fetchLanguageData.then(function(data) {
          var subtitleOption = languageChart.options.subtitle;
          subtitleOption.text = subtitleOption.text.replace(
            anchorText,
            '<a href="' + data.sourceUrl + '">' + anchorText + '</a>'
          );
          languageChart.setTitle(null, subtitleOption);
          languageChart.addSeries({
            name: data.label,
            data: data.data,
            dataLabels: {useHTML: true}
          });
        });
      });
    });
  });
});
