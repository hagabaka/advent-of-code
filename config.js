require.config({
  paths: {
    fetch: "bower_components/fetch/fetch",
    requirejs: "bower_components/requirejs/require",
    domready: "bower_components/domready/domReady",
    underscore: "bower_components/underscore/underscore",
    highcharts: "bower_components/highcharts/lib/highcharts",
    "highcharts-standalone": "bower_components/highcharts/lib/adapters/standalone-framework"
  },
  packages: [

  ],
  shim: {
    fetch: {
      exports: "fetch",
      init: function() {
        // Fail on HTTP errors
        return function(url, parameters) {
          return this.fetch(url, parameters).then(function(response) {
            if (response.status >= 200 && response.status < 300) {
              return response;
            } else {
              var error = new Error(response.statusText);
              error.response = response.text();
              throw error;
            }
          });
        }
      }
    },
    highcharts: {
      exports: "Highcharts",
      deps: ["highcharts-standalone"],
      init: function(standalone) {
        return this.Highcharts(standalone);
      }
    },
    "highcharts-standalone": {
      exports: "HighchartsAdapter"
    }
  }
});
