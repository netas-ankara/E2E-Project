"use strict";

var TestPage = require('./Test.PageObject');

Then(/^Check Website is opened$/, function () {
    return expect(TestPage.logoImg.isPresent()).to.eventually.be.false;
});