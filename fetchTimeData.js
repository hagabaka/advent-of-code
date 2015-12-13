define(['fetchData'], function(fetchData) {
  return fetchData.then(function(data) {
    var labels = [];
    var times = [];
    data.forEach(function(entry) {
      var match = /(\d\d):(\d\d):(\d\d)/.exec(entry.time);
      if(match) {
        labels.push(entry.label);
        times.push((parseInt(match[1]) * 60 * 60 + parseInt(match[2]) * 60 + parseInt(match[3])) * 1000);
      }
    });
    return {labels: labels, times: times};
  });
});
