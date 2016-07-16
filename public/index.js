var controllers = require('./controllers');
var directives = require('./directives');
var services = require('./services');
var _ = require('underscore');

var components = angular.module('mean-retail.components', ['ng']);

_.each(controllers, function(controller, name) {
  components.controller(name, controller);
});

_.each(directives, function(directive, name) {
  components.directive(name, directive);
});

_.each(services, function(factory, name) {
  components.factory(name, factory);
});

var app = angular.module('mean-retail', ['mean-retail.components', 'ngRoute']);

app.config(function($routeProvider) {
  $routeProvider.
    when('/', {
      templateUrl: '/templates/home_view.html',
      access: {
        requiredLogin: false
      }
    }).
    when('/category/:category', {
      templateUrl: '/templates/category_view.html',
      access: {
        requiredLogin: false
      }
    }).
    when('/checkout', {
      template: '<checkout></checkout>',
      access: {
        requiredLogin: true
      }
    }).
    when('/product/:id', {
      template: '<product-details></product-details>',
      access: {
        requiredLogin: false
      }
    }).
    otherwise('/');
});
