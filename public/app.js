'use strict';
var app = angular.module('myapp',[
        "ui.router"
    ]);
app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('movie', {
            url: "", // /movie
            templateUrl: "html/movie.html"
        })
        .state('movie.list', {
            url: "",
            templateUrl: "html/movie.list.html",
            controller: function ($scope) {
                $scope.items = ["A", "List", "Of", "Items"];
            }
        })
        .state('comments', {
            url: "",
            templateUrl: "html/comments.html"
        })
        .state('comments.list', {
            url: "",
            templateUrl: "html/comments.list.html",
            controller: function ($scope) {
                $scope.things = ["A", "Set", "Of", "Things"];
            }
        })
});
app.controller('movieAPI', function ($scope, $http) {
    var url_args = '?api_key=f260b6f56ad2d55f09a8935a464719b3&callback=JSON_CALLBACK';
    var base_url = 'http://api.themoviedb.org/3';

    $scope.result = 'Loading API';

    $http.jsonp(base_url + '/movie/5' + url_args).then(function(data, status){
        $scope.result = JSON.stringify(data);
    }, function(data, status){
        $scope.result = JSON.stringify(data);
    });
});

var socket = io();