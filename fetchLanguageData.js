define(['fetchData', 'fetch', 'tabulator'], function(fetchData, fetch, Tabulator) {
  return fetchData.then(function(days) {
    var githubUsers = new Tabulator();
    days.forEach(function(day) {
      day.entries.forEach(function(entry) {
        if(entry.url) {
          var match = /github\.com\/([^\/]+)/.exec(entry.url);
          if(match) {
            githubUsers.set(match[1], 1);
          }
        }
      });
    });
  
    var parameters = '?q=advent' + githubUsers.names().map(function(user) {
      return '+user:' + user;
    }).join('');
    return fetch('https://api.github.com/search/repositories' + parameters, {
      headers: {'User-Agent': 'hagabaka/advent-of-code'}
    }).then(function(data) {
      return data.json();
    }).then(function(json) {
      var languageCounts = new Tabulator();
      json.items.forEach(function(repo) {
        languageCounts.increment(repo.language);
      });
      var sourceUrl = 'https://github.com/search/' + parameters;
      return {
        sourceUrl: sourceUrl,
        label: [days[0].date, days[days.length - 1].date].join(' - '),
        data: languageCounts.names().map(function(language) {
          return {
            name: '<a href="' + sourceUrl + '+language:' + language + '">' + language + '</a>',
            y: languageCounts.get(language)
          };
        })
      };
    });
  });
});
