/*
Basic configuration to run your cucumber
feature files and step definitions with protractor.
**/

var env = require('./environment.js');

exports.config = {

    seleniumAddress: env.seleniumAddress,

    baseUrl: 'https://angularjs.org/',

    capabilities: {
        browserName:'chrome'
    },

    // multiCapabilities: [{
    //     'browserName': 'chrome'
    // }, {
    //     'browserName': 'firefox'
    // }],

    framework: 'custom',  // set to "custom" instead of cucumber.

    frameworkPath: require.resolve('protractor-cucumber-framework'),  // path relative to the current config file

    suites: {
        test: [
            'E2e/Features/Test.feature'
        ]
    },

    // SELENIUM_PROMISE_MANAGER: false,

    // cucumber command line options
    cucumberOpts: {
        require: [
            './E2E/StepDefinations/**/*.js',
            "./E2E/Shared/*.js"
        ],                                                                                  // require step definition files before executing features
        tags: [],                                                                           // <string[]> (expression) only execute the features or scenarios with tags matching the expression
        strict: true,                                                                       // <boolean> fail if there are any undefined or pending steps
        format: ['json:Reports/cucumber_report.json', 'node_modules/cucumber-pretty'],      // <string[]> (type[:path]) specify the output format, optionally supply PATH to redirect formatter output (repeatable)
        'dry-run': false,                                                                   // <boolean> invoke formatters without executing steps
        compiler: [],                                                                       // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
        'no-colors': true
    },

    // Here the magic happens
    // plugins: [{
    //     package: 'protractor-multiple-cucumber-html-reporter-plugin',
    //     options:{
    //         automaticallyGenerateReport: true,
    //         removeExistingJsonReportFile: true,
    //         openReportInBrowser: false,
    //         reportName: "E2E Report",
    //         customData: {
    //             title: 'Run info',
    //             data: [
    //                 {label: 'Project', value: 'Custom project'},
    //                 {label: 'Release', value: '1.2.3'},
    //                 {label: 'Cycle', value: 'B11221.34321'},
    //                 {label: 'Execution Start Time', value: 'Nov 19th 2017, 02:31 PM EST'},
    //                 {label: 'Execution End Time', value: 'Nov 19th 2017, 02:56 PM EST'}
    //             ]
    //         }
    //     }
    // }],

    params: {
    },

    beforeLaunch: () => {
        var moment = require('moment');
        moment.locale('en');
        global.testStartDate = moment().format('LLLL');
    },

    onPrepare: () => {

        let reportName = browser.params.reportName || 'cucumber_report';
        let buildUrl = browser.params.buildUrl || "localMachine/";
        let isGenerateReportZip = browser.params.isGenerateReportZip || false;
        let sendMail = browser.params.sendMail || false;
        let hasAttachmentInMail = browser.params.hasAttachmentInMail || false;

        var envParams = {
            reportName: reportName,
            buildUrl: buildUrl,
            notifications : {
                isGenerateReportZip : isGenerateReportZip,
                sendMail: sendMail,
                hasAttachmentInMail: hasAttachmentInMail // required isGenerateReportZip = true otherwise it does not work!!
            }
        };

        global.ENVIRONMENT = envParams;
        global.EC = global.until = protractor.ExpectedConditions;
        global.__basefolder = __dirname + '/';
        global.CommonUtils = require('./E2E/Shared/CommonUtils');

        CommonUtils.osInfo();
        CommonUtils.cucumberSettings();
        CommonUtils.chaiSettings();
    },

    onComplete: () => {
        var moment = require('moment');
        moment.locale('en');
        global.testFinishDate = moment().format('LLLL');
    },

    onCleanUp: () => {
        return new Promise(function (fulfill, reject) {
            CommonUtils.generateHtmlReport(fulfill, reject);
        }).then(function () {
            return new Promise(function (fulfill, reject){
                CommonUtils.generateReportZipFile(fulfill, reject);
            }).then(function () {
                return new Promise(function (fulfill, reject){
                    CommonUtils.sendMail(fulfill, reject);
                });
            });
        });
    }
};