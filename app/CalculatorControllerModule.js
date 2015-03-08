'use strict';

var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;

function getParamNames(func) {
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if(result === null)
        result = [];
    return result;
}

var m = angular.module('CalculatorControllerModule', []);

m.controller('CalculatorController', ['$scope',function($scope) {
    //initialization code
    $scope.calculate=function(){
        $scope.calculatedFormulas=$scope.id;
    };



    var costOfCapital = function(rf,beta,rm) {
        return rf + beta*(rm-rf);
    }

    var costOfCapital2 = function(rf,beta,rm) {
        return rf + beta*(rm-rf) +1;
    }

    var costOfCapital3 = function(rf,beta,rm) {
        return rf + beta*(rm-rf) +2;
    }

    var businessContext = {
        rf: 0.03,
        beta:1.5,
        rm:0.05
    };

    var formulaSystem  = [costOfCapital,costOfCapital2,costOfCapital3];

    for (var i = 0; i++; i<formulaSystem.length) {
        var requiredParamNames=getParamNames(formulaSystem[i]);

        var requiredParamValues;
        for(var j=0; j++; requiredParamNames.length) {
            requiredParamValues[j]=businessContext[requiredParamNames[j]];
        }
        var result = formulaSystem[i].apply(null,requiredParamValues);

        console.log(formulaSystem[i] + " = " +result);
    };

}]);