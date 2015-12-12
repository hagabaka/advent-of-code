define(['fetch'], function(fetch) {
  var dataUrl = 'https://api.import.io/store/connector/c964b58e-c9fc-4bbd-8e34-7492af0bd360/_query?input=webpage/url:http%3A%2F%2Fadventofcode.com%2Fleaderboard&&_apikey=00853953ec7748798bdde3fb84140889d14f40778f1e5563efa749574acdab1b8c8a8a4976e3401a74bf6ff813784f370280fc751dc9c124afbfce79f522ba562bc4eed3ac3fb316bc0b1264182d6a5c';
  return fetch(dataUrl).then(function(response) {
    return response.json();
  }).then(function(json) {
    var data = json.results.map(function(entry) {
      var output = {
        rank: entry.leaderboard_number,
        starCount: entry.starcount_number,
        url: entry.link,
        avatar: entry.image,
        raw: entry.content
      };
      var match = /\d\d:\d\d:\d\d (.*)/.exec(entry.content);
      if(match) {
        output.name = match[1];
      }
      output.label = output.name;
      if(output.avatar) {
        output.label = '<img class="avatar" src="' + output.avatar + '">' + output.label;
      }
      if(output.url) {
        output.label = '<a href="' + output.url + '">' + output.label + '</a>';
      }
      return output;
    });
    return data;
  });
});
