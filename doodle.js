'use strict';

//PART 1
//declaration of the business context, i.e. an object containing all data from ODS-P and RDSPLUS required for this case
//this can me mightly nested (and probably will contain nested objects as well as arrays)
//this is the object the LoaderService will return after making all the calls, and that we can show (parts of) in the application
var businessContext = {
    rf: 2,
    beta:1.5,
    rm: 5,
    stuff : {
        a: 1,
        b: 2,
        series:[2,4,6,8,10] //=30
    }
};


//PART 2
//declaration of functions representing individual formulas
//this example starts from the TOP and we progressively "deconstruct" the businessContext into smaller pieces
//what's important, is that we do not specifically declare parameters in functions, but rather pass it with "call" and
//bind to "this" of each function - this allows us to quickly prototype a complex tree and pass large structures
//without gigantic function declarations

function functionA() {
    return functionB1.call(this.stuff)+functionB2.call(this);
}

function functionB1() {
    return this.a*this.b*functionC1.call(this.series); //1*2*30 = 60
}

function functionB2() {
    return this.rf + this.beta*(this.rm-this.rf); //2 + 1.5*(5-2) = 6.5
}

function functionC1(){ //basically sum up
    return this.reduce(function(pv, cv) { return pv + cv; }, 0);
}

var totalResults=functionA.call(businessContext); //66.5

console.log(totalResults);





process.exit();