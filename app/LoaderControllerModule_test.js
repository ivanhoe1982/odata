'use strict';

describe('LoaderServiceModule', function() {

    var LoaderService;

    beforeEach(module('LoaderServiceModule'));

    beforeEach(inject(function(_LoaderService_) {
        LoaderService = _LoaderService_;
    }));

    describe('upon load', function () {

        it('configuration should be passed with URLs to ODSP and RDSPLUS');

        it('when initialized called, it should establish connections to services', function (done) {
            //inject(function (LoaderService) {

                LoaderService.initialize(function (err, odsp, rdsp) {

                    odsp.should.be.defined;
                    rdsp.should.be.defined;
                    rdsp.should.be.a("object");

                    done(err);
                });
            //});
        });

        it('should respond to method', function (done) {
            LoaderService.should.respondTo('dataForPricing');
        });
    });


    //describe('ODSP', function () {
    //
    //
    //    it('should return data for valid pricing ID', function (done) {
    //    });
    //
    //    it('should throw an error for malformed pricing ID', function (done) {
    //    });
    //
    //    it('should throw an error for nonexistent pricing ID', function (done) {
    //    });
    //    it('should check returned result for ... and throw if not present', function (done) {
    //    });
    //});
});
