"use strict";

setDefaultTimeout(60000); // asynchronous hooks and steps timeout

BeforeAll(function () {
    CommonUtils.browserSettings();
});

After(function (testCase) {
    var world = this;

    if (testCase.result.status === Status.FAILED) {
        return browser.takeScreenshot().then(function(screenShot) {
            // screenShot is a base-64 encoded PNG
            world.attach(screenShot, 'image/png');
        });
    }

    return browser.quit();
});