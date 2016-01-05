'use strict';

var app = angular.module('myapp',[
        'ngSanitize',
        'ui.router',
        'ui.select',
        'djangoRESTResources' //connects django REST API and Angualar services (via djResource)
    ]);

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('movie', {
            url: "/",
            templateUrl: "html/movie.html"
        })
        .state('about', {
            url: "/about",
            templateUrl: "html/about.html"
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
    $scope.movieChanged = function(movie){
        console.log('movieChanged');
        if(scope.movie != undefined){
            console.log(scope.movie.id);
        }
    }
});
app.directive('movieSummary', function() {
    return {
        restrict: 'E',
        templateUrl: 'html/movie_result.html',
        scope: {
            movie: '='
        }
    }
});
app.directive('movieChat', function(){
    return {
        restrict: 'E',
        templateUrl: 'html/movie_chat.html',
        //require: '^movieSummary',
        scope: {
            movie: '=' // XML-attribute model corresponds to HTML variable {{model}} (same as =model)
        },
        link: function(scope, element){
            console.log('link');
            if(scope.movie != undefined){
                console.log(scope.movie.id);
            }
        }
    }
});

var c_api_base = 'http://api.search-for-a-movie.tk/';


var socket = io();