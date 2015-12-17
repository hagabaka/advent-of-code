define(['fetch'], function(fetch) {
  return fetch('languages.json').then(function(response) {
    return response.json();
  });
});
