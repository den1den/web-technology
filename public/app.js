/**
 * Created by Dennis on 5-1-2016.
 */
'use strict';

var myapp = angular.module('myApp', ["ui.router"])
myapp.config(function($stateProvider, $urlRouterProvider){

    // For any unmatched url, send to /route1
    $urlRouterProvider.otherwise("/route1")

    $stateProvider
        .state('route1', {
            url: "/route1",
            templateUrl: "html/state1.html"
        })
        .state('route1.list', {
            url: "/list",
            templateUrl: "html/state1.list.html",
            controller: function($scope){
                $scope.items = ["A", "List", "Of", "Items"];
            }
        })

        .state('route2', {
            url: "/route2",
            templateUrl: "html/state2.html"
        })
        .state('route2.list', {
            url: "/list",
            templateUrl: "html/state2.list.html",
            controller: function($scope){
                $scope.things = ["A", "Set", "Of", "Things"];
            }
        })
});
