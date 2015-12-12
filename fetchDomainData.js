define(['fetchData'], function(fetchData) {
  return fetchData.then(function(data) {
    var domains = {'No Website': 0};
    data.forEach(function(entry) {
      if(entry.url) {
        var match = /\/\/([a-zA-Z.]+)/.exec(entry.url);
        if(match) {
          var domain = match[1];
          if (!(domain in domains)) {
            domains[domain] = 1;
          } else {
            domains[domain]++;
          }
        }
      } else {
        domains['No Website']++;
      }
    });
    var domainData = [];
    for(var domain in domains) {
      domainData.push({
        name: '<a href="https://' + domain + '">' + domain + '</a>',
        y: domains[domain]
      });
    }
    return domainData;
  });
});
