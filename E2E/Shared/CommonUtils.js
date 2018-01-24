"use strict";

module.exports = function () {
    let module = {};

    /**
     * Operation System Info
     */
    module.osInfo = () => {
        // console.log(process.env);
        var os = require('os');
        var userInfo = require('user-info');

        switch (os.type()) {
            case "Linux":
                global.osType = "Linux";
                break;

            case "Darwin":
                global.osType = "OS X";

            case "Windows_NT":
                global.osType = "Windows";
        }

        global.osRelease = os.release();
        global.osUserName = userInfo()['username'];
    }

    /**
     * Set Browser default behaviours
     */
    module.browserSettings = () => {
        browser.manage().window().maximize(); // maximize the browser before executing the feature files

        browser.ignoreSynchronization = true;

        browser.manage().timeouts().setScriptTimeout(7000);
        browser.manage().timeouts().implicitlyWait(5000);
        browser.manage().timeouts().pageLoadTimeout(60000);

        browser.getCapabilities().then(function (capabilities) {
            global.browserName = capabilities.get('browserName');
            global.browserVersion = capabilities.get('version');
        });
    };

    /**
     * Set Cucumber variables to global
     */
    module.cucumberSettings = () => {
        // Set cucumber variable to Global
        const { Given, When, Then, BeforeAll, After, Status, setDefaultTimeout } = require('cucumber');

        global.Given = Given;
        global.When = When;
        global.Then = Then;
        global.BeforeAll = BeforeAll;
        global.After = After;
        global.Status = Status;
        global.setDefaultTimeout = setDefaultTimeout;
    };

    /**
     * Chai validation settings
     */
    module.chaiSettings = () => {
        const   chai               = require('chai'),
                chaiAsPromised     = require('chai-as-promised'),
                expect             = chai.expect;

        chai.use(chaiAsPromised);

        global.chai = chai;
        global.expect = expect;
    };

    /**
     * Generate E2E tests report
     * @param fullfill
     * @param reject
     */
    module.generateHtmlReport = (fullfill, reject) => {
        const report = require('multiple-cucumber-html-reporter');

        report.generate({
            jsonDir: __basefolder + 'Reports/',
            reportPath: __basefolder + 'Reports/report/',
            metadata:{
                browser: {
                    name: browserName,
                    version: browserVersion
                },
                device: osUserName,
                platform: {
                    name: osType,
                    version: osRelease
                }
            },
            automaticallyGenerateReport: true,
            removeExistingJsonReportFile: true,
            openReportInBrowser: false,
            reportName: "E2E Report",
            customData: {
                title: 'Run info',
                data: [
                    {label: 'Machine User Name', value: osUserName},
                    {label: 'Project', value: 'E2E-Project'},
                    {label: 'Release', value: '1.0.0'},
                    {label: 'Execution Start Time', value: testStartDate},
                    {label: 'Execution End Time', value: testFinishDate}
                ]
            }
        });

        fullfill();
    };

    /**
     * GEnerate Zip file from Report
     * @param fullfill
     * @param reject
     */
    module.generateReportZipFile = (fullfill, reject) => {

        if(!ENVIRONMENT.notifications.isGenerateReportZip) {
            fullfill();

            return;
        }

        // require modules
        const fs = require('fs');
        const archiver = require('archiver');

        console.log("Zip entire directory begins");

        // create a file to stream archive data to.
        var output = fs.createWriteStream(__basefolder + '/report.zip');
        var archive = archiver('zip', {
            store: true
        });

        // listen for all archive data to be written
        // 'close' event is fired only when a file descriptor is involved
        output.on('close', function() {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');

            fullfill();
        });

        // This event is fired when the data source is drained no matter what was the data source.
        // It is not part of this library but rather from the NodeJS Stream API.
        // @see: https://nodejs.org/api/stream.html#stream_event_end
        output.on('end', function() {
            console.log('Data has been drained');
        });

        // good practice to catch warnings (ie stat failures and other non-blocking errors)
        archive.on('warning', function(err) {
            if (err.code === 'ENOENT') {
                // log warning
            } else {
                // throw error
                throw err;
            }
        });

        // good practice to catch this error explicitly
        archive.on('error', function(err) {
            throw err;
        });

        // pipe archive data to the file
        archive.pipe(output);

        // append files from a sub-directory, putting its contents at the root of archive
        archive.directory('Reports/', false);

        // finalize the archive (ie we are done appending files but streams have to finish yet)
        // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
        archive.finalize();
    };

    /**
     * Send Mail
     * @param fullfill
     * @param reject
     */
    module.sendMail = (fullfill, reject) => {

        if(!ENVIRONMENT.notifications.sendMail) {
            fullfill();

            return;
        }

        const nodeMailer = require('nodemailer');

        let reportName = ENVIRONMENT.reportName;
        let buildUrl = ENVIRONMENT.buildUrl;
        let htmlBody = "";

        console.log("Sending email begins");

        // create reusable transporter object using the default SMTP transport
        let transporter = nodeMailer.createTransport({
            host: 'your host',
            port: 25,
            secure: false,
            auth: {
                user: 'your user name',
                pass: 'password'
            },
            ignoreTLS: true
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"AYDES NETAS DEVELOPMENT 👻" <from-mail>', // sender address
            to: 'To-mail', // list of receivers
            subject: `E2E Test Raporu ${reportName} 👻` // Subject line
        };

        if(ENVIRONMENT.notifications.isGenerateReportZip && ENVIRONMENT.notifications.hasAttachmentInMail) {
            htmlBody += `<b>
                   ${reportName} için E2E test raporu arşivlenmiş olarak ektedir.
                   </b> 
                   <br />
                   <br />
                  `;

            mailOptions.attachments = [
                {
                    filename: ENVIRONMENT.reportName + `.zip`,
                    path: 'report.zip' // stream this file
                }
            ];
        }

        htmlBody += `Yapılandırma Sonucu : ${buildUrl}cucumber-html-reports/overview-features.html`;

        mailOptions.html = htmlBody;

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("An error when sending mail" + error);

                reject(error);
            }
            else {
                console.log('Message %s sent: %s', info.messageId, info.response);

                fulfill();
            }
        });
    };

    return module;
}();