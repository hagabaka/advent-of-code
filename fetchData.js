define(['fetch'], function(fetch) {
  return fetch('data.json').then(function(body) {
    return body.json();
  });
});
