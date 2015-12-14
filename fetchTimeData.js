define(['fetchData'], function(fetchData) {
  return fetchData.then(function(days) {
    var labelSet = {};
    var listedData = days.map(function(day) {
      var times = [];
      var ranks = [];
      day.entries.forEach(function(entry) {
        labelSet[entry.label] = true;
        var match = /(\d\d):(\d\d):(\d\d)/.exec(entry.time);
        if(match) {
          times[entry.label] = (parseInt(match[1]) * 60 * 60 + parseInt(match[2]) * 60 + parseInt(match[3])) * 1000;
          ranks[entry.label] = parseInt(entry.rank);
        }
      });
      return {date: day.date, times: times, ranks: ranks};
    });
    var latestRanks = listedData[listedData.length - 1].ranks;
    var labels = Object.keys(labelSet).sort(function(a, b) {
      return (latestRanks[a] || Infinity) - (latestRanks[b] || Infinity);
    });
    return listedData.map(function(day) {
      return {
        date: day.date,
        labels: labels,
        times: labels.map(function(label) {
          return day.times[label] || null;
        })
      };
    });
  });
});
