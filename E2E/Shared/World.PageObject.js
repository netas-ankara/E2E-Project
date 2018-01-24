"use strict";

const WorldCommon = function () {
    this.logoImg = element(By.xpath('//*[@id="logo"]/a/img'));
};

module.exports = new WorldCommon();