//'use strict';

//PART 1
//declaration of the business context, i.e. an object containing all data from ODS-P and RDSPLUS required for this case
//this can be mightly nested (and probably will contain nested objects as well as arrays)
//this is the object the LoaderService will eventually return after making all the calls, and that we can show (parts of) in the application
var businessContext = {
    rf: 2,
    beta:1.5,
    rm: 5,
    stuff : {
        a: 1,
        b: 2,
        series:[2,4,6,8,10], //=30
        evenmorestuff: {
            x: 2,
            y: 7,
            z: 10
        }
    }
};


//PART 2
//declaration of functions representing individual formulas
//this example starts from the TOP and we progressively "deconstruct" the businessContext into smaller pieces
//what's important, is that we do not specifically declare parameters in functions, but rather pass it with "call" and
//bind to "this" of each function - this allows us to quickly prototype a complex tree and pass large structures
//without gigantic function declarations


///HELPER registering calls on a result tree
function register(tree,description, math, f) {
    tree[arguments.callee.caller.name]={
        description: description,
        math: math
    };
    var tree = tree[arguments.callee.caller.name];
    tree['result']=0;
    var r = f.call(this,tree);
    tree['result']=r;
    return r;
}
///END HELPER



//TOP LEVEL individual formula template
//every formula declared this way will be available as a 'box' in final treemap visualization
//each formula will track its dependencies
//first two lines of the declaration are obligatory if the formula is to propagate business context and store result
//in the tree
function functionA(tree) {
    return register.call(this,tree,'top formula','B1+B2',function(tree){

        //HERE GOES YOUR COMPLEX FORMULA operating on piece of business context passed into 'this'
        //subsequent calls to other nested functions that need to be in a result tree need to follow this pattern:
        //
        //     functionName.call(this.something,tree)
        //
        //where this.something is the whole or piece of a branch of business context, like here:
        //functionB1 only takes the 'stuff' branch of the businessContext, and functionB2 takes the whole businessContext

        var r = functionB1.call(this.stuff,tree)+functionB2.call(this,tree);

        return r;

        //ALWAYS ENDS with return of the numerical result!!!

    });
}

function functionB1(tree) {
    return register.call(this,tree,'some other','b+C1',function(tree) {

        return this.a * this.b * functionC1.call(this.series, tree); //1*2*30 = 60

    });
}

function functionB2(tree) {
    return register.call(this, tree, 'and another','rf+beta*(rm-rf)',function (tree) {

        return this.rf + this.beta * (this.rm - this.rf); //2 + 1.5*(5-2) = 6.5

    });
}


function functionC1(tree) { //basically sum up
    return register.call(this, tree, 'and summing up vector','SUM(x)', function (tree) {

        return this.reduceRight(function (pv, cv) {
            return pv + cv;
        }, 0); //30

    });
}

// TESTING THE EQUATIONS


var root = {}; //this is where my result tree goes, eventually to be returned to D3 for treemap

var totalResults=functionA.call(businessContext,root); //call everything, just by calling top function 66.5

console.log(totalResults);
console.log("From root:\n" + DumpObjectIndented(root,'')); //and this can go straight to the treemap



var partial={};
var partialResults=functionB1.call(businessContext.stuff, partial);

console.log("\n\nJust partial\n:" + DumpObjectIndented(partial,'')); //and this can go straight to the treemap


//WHY is it all necessary?
//1. complete separation of loading of the data from calculation = calculation will work on a
// businessContext object, irrespective of where it comes from, and irrespective of inconsistencies
// of the data in source databases
//2. formulas are documented right in the code, math representation can also be defined right away
//3. complete structure of calculation is preserved and can be directly used to draw a tree map
//4. various visualization can be 'plugged' independently
//5. multiple pricings can be retrieved, calculated and visualized on one page
//6. all formulas can be tested independently of everything else, in pieces or in parts
//7. very easy to cache or save the results if necessary

//pretty print for debug
function DumpObjectIndented(obj, indent)
{
    var result = "";
    if (indent == null) indent = "";

    for (var property in obj)
    {
        var value = obj[property];
        if (typeof value == 'string')
            value = "'" + value + "'";
        else if (typeof value == 'object')
        {
            if (value instanceof Array)
            {
                // Just let JS convert the Array to a string!
                value = "[ " + value + " ]";
            }
            else
            {
                // Recursive dump
                // (replace "  " by "\t" or something else if you prefer)
                var od = DumpObjectIndented(value, indent + "\t");
                // If you like { on the same line as the key
                //value = "{\n" + od + "\n" + indent + "}";
                // If you prefer { and } to be aligned
                value = "\n" + indent + "{\n" + od + "\n" + indent + "}";
            }
        }
        result += indent + "'" + property + "' : " + value + ",\n";
    }
    return result.replace(/,\n$/, "");
}

process.exit();
