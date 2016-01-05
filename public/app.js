'use strict';
var app = angular.module('myapp',[
        'ngSanitize',
        "ui.router",
        'ui.select'
    ]);
app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('movie', {
            url: "", // /movie
            templateUrl: "html/movies.html"
        })
        .state('movie.list', {
            url: "",
            templateUrl: "html/movies.list.html",
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
var m_api_key = 'f260b6f56ad2d55f09a8935a464719b3';
var m_api_url = 'http://api.themoviedb.org/3';
app.controller('movieAPI', function ($scope, $http) {
    $scope.result = 'Type a movie to see the results';
    //$http.jsonp(m_api_url + '/search/movie', {
    //    params: {
    //        query: 'NNNNNNNNNNNNNNN',
    //        page: page,
    //        api_key: m_api_key,
    //        callback: 'JSON_CALLBACK'
    //    }
    //}).then(function(response) {
    //    $scope.result = response.data.results;
    //});

    $scope.clear = function(){
        $scope.movie.selected = undefined;
    };
    $scope.movie = {};
    $scope.refreshMovie = function(query) {
        var page = undefined;
        if (page == undefined){
            page = 1;
        }
        if (query == ''){
            return undefined;
        }
        else return $http.jsonp(m_api_url + '/search/movie', {
            params: {
                query: query,
                page: page,
                api_key: m_api_key,
                callback: 'JSON_CALLBACK'
            }
        }).then(function(response) {
            if ('results' in response.data) {
                console.log(response.data['results']);
                $scope.movies = response.data['results'];
            } else {
                $scope.movies = [];
            }
        }, function errorCallback(response) {
            console.log('Error in API call');
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    };
});

var socket = io();