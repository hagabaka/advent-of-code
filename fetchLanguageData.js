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

    var maxRequests = 5;
    var urlQueue = [];
    var languageCounts = new Tabulator();
    function fetchGitHubData(url) {
      return fetch(url, {
        headers: {'User-Agent': 'hagabaka/advent-of-code'}
      }).then(function(response) {
        if(urlQueue.length <= maxRequests) {
          var links = response.headers.get('Link');
          if(links) {
            var match = /<([^>]+)>; rel="next"/.exec(links);
            if(match) {
              urlQueue.push(match[1]);
            }
          }
        }
        return response.json();
      }).then(function(json) {
        json.items.forEach(function(repo) {
          languageCounts.increment(repo.language);
        });
      }).then(function() {
        if(urlQueue.length > 0) {
          return fetchGitHubData(urlQueue.shift());
        } else {
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
        }
      });
    }

    return fetchGitHubData('https://api.github.com/search/repositories' + parameters);
  });
});
