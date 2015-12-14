define(['fetchData', 'tabulator'], function(fetchData, Tabulator) {
  var noWebsiteText = 'No Website Listed';
  function makeDomainData(tabulator) {
    return tabulator.names().map(function(domain) {
      var label = domain;
      if(label !== noWebsiteText) {
        label ='<a href="https://' + domain + '">' + domain + '</a>'; 
      }
      return {
        name: label,
        y: tabulator.get(domain)
      };
    });
  }
  return fetchData.then(function(days) {
    var data = days.map(function(day) {
      var domains = new Tabulator();
      domains.set(noWebsiteText, 0);
      day.entries.forEach(function(entry) {
        if(entry.url) {
          var match = /\/\/([a-zA-Z.]+)/.exec(entry.url);
          if(match) {
            var domain = match[1];
            domains.increment(domain);
          }
        } else {
          domains.increment(noWebsiteText);
        }
      });
      return {date: day.date, data: makeDomainData(domains)};
    });
    return data;
  });
});
