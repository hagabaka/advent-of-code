define(['fetch'], function(fetch) {
  return fetch('data.json').then(function(body) {
    return body.json();
  }).then(function(data) {
    return data.slice(-1)[0].entries;
  });
});
