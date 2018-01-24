"use strict";

var WorldCommon = require('./World.PageObject');

Given(/^I open(?: "(.*)")? the website/, function (link) {
    link = link || browser.baseUrl;

    return browser.get(link);
});