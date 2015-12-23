define(['fetch'], function(fetch) {
  function mergeLanguages(languages) {
    var values = languages.reduce(function(merged, language) {
      return {
        names: merged.names.concat([language.name]),
        y: language.y + merged.y
      };
    }, {names: [], y: 0});
    return {
      name: values.names.join(' | '),
      y: values.y
    };
  }

  return fetch('languages.json').then(function(response) {
    return response.json();
  }).then(function(languageData) {
    // merge the languages with count = 1 or 2 to make the pie chart legible
    var only1 = [];
    var only2 = [];
    var more = [];
    languageData.data.forEach(function(language) {
      if(language.y === 1) {
        only1.push(language);
      } else if(language.y === 2) {
        only2.push(language);
      } else {
        more.push(language);
      }
    });
    if(only1.length >= 3) {
      only1 = mergeLanguages(only1);
      only1.color = '#eeeeee';
    }
    if(only2.length >= 4) {
      only2 = mergeLanguages(only2);
      only2.color = '#cccccc';
    }
    languageData.data = more.concat(only2).concat(only1);
    return languageData;
  });
});
