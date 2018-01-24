"use strict";

const TestPage = function () {
    this.logoImg = element(By.xpath('//*[@id="logo"]/a/img'));
};

module.exports = new TestPage();