'use strict';

//helper functions
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;

function getParamNames(func) {
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if(result === null)
        result = [];
    return result;
}
//end helper functions


//PART 1
//declaration of the business context, i.e. an object containing all data from ODS-P and RDSPLUS required for this case
//this can me mightly nested (and probably will contain nested objects as well as arrays) but nesting is currently not supported
//this is what the LoaderService will return after making all the calls
var businessContext = {
    rf: 0.03,
    beta:1.5,
    rm:0.05
};


//PART 2
//declaration of functions representing individual formulas
function costOfCapital(rf,beta,rm) {
    return rf + beta*(rm-rf);
}

function costOfCapital2(rf,beta,rm) {
    return rf + beta*(rm-rf) +1;
}

function costOfCapital3(rf,beta,rm) {
    return rf + beta*(rm-rf) +2;
}

//we have to declare a list of all TOP LEVEL formulas that we want to execute later on
//if there is only one top level formula than this will be of little use
var formulaSystem  = [costOfCapital,costOfCapital2,costOfCapital3];

var injector = function(f){
    var lookup = function() {
        console.log('injection');
        f.apply(null,arguments);
    };

    return lookup;
};


//PART 3
//loop through all atomic formulas, lookup arguments they need in businessContext and execute them
//then store the result in the result object that can be consumed by the visualization

//this 'matching' of arguments of functions from businessContext is what allows us for short, reusable code
//using for loops instead of maps for sake of clarity of code

function executeAll(formulaSystem,businessContext){
    var result = {}; //empty object
    for (var i = 0; i<formulaSystem.length;  i++) {
        //figure out names of parameters of any given function
        var requiredParamNames=getParamNames(formulaSystem[i]);

        var requiredParamValues=[];
        //...and then look up values of the same name in businessContext
        for(var j=0; j<requiredParamNames.length; j++) {
            requiredParamValues[j]=businessContext[requiredParamNames[j]];
        }
        result[formulaSystem[i].name] = formulaSystem[i].apply(null,requiredParamValues);
    }
    return result;
}

function executeAll2(formulaSystem,businessContext){
    var result = {}; //empty object
    for (var i = 0; i<formulaSystem.length;  i++) {
        formulaSystem[i]=formulaSystem[i].bind(businessContext);

        result[formulaSystem[i].name] = formulaSystem[i].apply(null,requiredParamValues);
    }
    return result;
}

var totalResults=executeAll(formulaSystem,businessContext);

var totalResults2=executeAll2(formulaSystem,businessContext);

console.log(totalResults);
console.log(totalResults2);

//////2






process.exit();