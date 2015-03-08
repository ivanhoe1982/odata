'use strict';

//this module is declared as a service
//this means the object returned by it is a singleton - there is only one across application
var m = angular.module('LoaderServiceModule', ['jaydata']);

m.service('LoaderService', ['$data',function($data) { //$data is injected by jaydata
//initialization of databases

    var dbODSPvar;
    var dbRDSPLUSvar;

    var initialize = function(callback) {

        //return a promise, that resolves only once both connections are made
        return  $data.initService('http://jaydata.org/examples/Northwind.svc/')
            .then(function (northwind) {

                dbODSPvar=northwind.Customers;

            },function(err){
                callback(new Error('ODSP not available: '+err.requestUri));
            })
            .then(function() {
                $data.initService('http://jaydata.org/examples/Northwind.svc/')
                    .then(function (northwind) {
                        dbRDSPLUSvar=northwind;
                        callback(null,dbODSPvar,dbRDSPLUSvar);
                    },function(err){
                        callback(new Error('RDSPLUS not available: '+err.requestUri));
                    });
            })

    };

//these are individual calls to specific sources

    var odsplusbyid = function(id,odscallback) {
        dbODSP.Customers.toArray(function(odspresult) {
            //TODO: transform the result somehow
            //TODO: call RDSPLUS based on ODSP results
            odscallback(odspresult);

        });
    };

    var rdsplusbyid=function(id,rdscallback) {
        dbRDSPLUS.Customers.toArray(function(rdsresult) {
            //TODO: transform the result somehow
            rdscallback(rdsresult);
        });
        };

//HERE WE TIE IT ALL TOGETHER INTO A CALL CHAIN that will return combined data from both ODSP and RDSPLUS

    var chain = function(id){
        var combined;

        odsplusbyid(id,function(result){
            combined.ods=result;
            var rdsid=combined.ods.rdsid;

            rdsplusbyid(rdsid,function(rdsresult) {
                combined.rds=rdsresult;
            });
        });

    };


//methods returned to the outsideWorld
    return {
        initialize : initialize,
        dataForPricing: chain,
        //rdsplusbyid : rdsplusbyid,
        //odsplusbyid : odsplusbyid
        last: 0
    };


}]);