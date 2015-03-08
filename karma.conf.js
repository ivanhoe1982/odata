module.exports = function(config){
    config.set({

        basePath : 'app',

        plugins : [
            'karma-chrome-launcher',
            'karma-junit-reporter',
            'karma-mocha',
            'karma-chai'
            //'karma-jasmine'
        ],

        frameworks: ['mocha','chai'],
        //frameworks: ['jasmine'],

        singleRun: true,

        autoWatch : false,

        browsers : ['Chrome'],

        junitReporter : {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        },

        files : [
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/jQuery/dist/jquery.min.js',
            'bower_components/jaydata/datajs-1.0.3.min.js',
            'bower_components/angular/angular.js',
            'bower_components/jaydata/release/jaydata.js',
            'bower_components/jaydata/release/jaydatamodules/angular.js',
            'bower_components/jaydata/release/jaydataproviders/oDataProvider.js',
            'LoaderServiceModule.js',

            '*_test.js'
        ]


    });
};
