define(['fetchData', 'tabulator'], function(fetchData, Tabulator) {
  var noWebsiteText = 'No Website Listed';
  var colors = {
    // source: http://brandcolors.net/
    'github.com': '#333333',
    'plus.google.com': '#dc4e41',
    'www.reddit.com': '#ff4500',
    'twitter.com': '#55acee',
  };
  colors[noWebsiteText] = '#eeeeee';
  function makeDomainData(tabulator) {
    return tabulator.names().map(function(domain) {
      var label = domain;
      if(label !== noWebsiteText) {
        label ='<a href="https://' + domain + '">' + domain + '</a>'; 
      }
      return {
        name: label,
        y: tabulator.get(domain),
        color: colors[domain]
      };
    });
  }
  function makeDomainTabulator() {
    var tabulator = new Tabulator();
    tabulator.set(noWebsiteText, 0);
    return tabulator;
  }
  function countEntries(entries, domains, countedUrls) {
    entries.forEach(function(entry) {
      if(entry.url && (!countedUrls || !countedUrls.get(entry.url))) {
        var match = /\/\/([a-zA-Z.]+)/.exec(entry.url);
        if(match) {
          var domain = match[1];
          domains.increment(domain);
        }
      } else {
        domains.increment(noWebsiteText);
      }
    });
  }
  return fetchData.then(function(days) {
    var totalDomains = makeDomainTabulator();
    var countedUrls = new Tabulator();
    days.forEach(function(day) {
      countEntries(day.entries, totalDomains, countedUrls);
    });
    return [{
      date: days[0].date + ' - ' + days[days.length - 1].date,
      data: makeDomainData(totalDomains)
    }];
  });
});
