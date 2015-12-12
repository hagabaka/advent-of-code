define(['fetchData', 'fetch'], function(fetchData, fetch) {
  return fetchData.then(function(data) {
    var languages = {};
    var githubApi = 'https://api.github.com/';
    var githubUsers = [];
    data.forEach(function(entry) {
      if(entry.url) {
        var match = /github\.com\/([^\/]+)/.exec(entry.url);
        if(match) {
          githubUsers.push(match[1]);
        }
      }
    });
   
    var url = githubApi + 'search/repositories?q=advent' + githubUsers.map(function(user) {
      return '+user:' + user;
    }).join('');
    return fetch(url, {
      headers: {'User-Agent': 'hagabaka'}
    }).then(function(data) {
      return data.json();
    }).then(function(json) {
      json.items.forEach(function(repo) {
        if(!(repo.language in languages)) {
          languages[repo.language] = 1;
        } else {
          languages[repo.language]++;
        }
      });
      var languageData = [];
      for(var language in languages) {
        languageData.push({
          name: '<a href="' + url + '+language:' + language + '">' + language + '</a>',
          y: languages[language]
        });
      }
      return {sourceUrl: url, data: languageData};
    });
  });
});
