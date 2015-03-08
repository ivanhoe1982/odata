'use strict';

var m = angular.module('DebugViewControllerModule', []);

m.controller('DebugViewController', ['$scope','LoaderService',function($scope,LoaderService) {
    //initialization code
    $scope.loadData=function(){
        LoaderService.dataForPricing($scope.id,function(result){
            $scope.loadedResults=JSON.stringify(result);

        });
    };

    //event handlers

    //watches

}]);