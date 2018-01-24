
# PROCRACTOR - CUCUMBER - WEB-DRIVER MANAGER - MULTIPLE CUCUMBER HTML REPORTER ###

## README #

An end to end testing platform for Web project.

### This repository includes ###

End to end specs for Project windows.

### How do I get set up? ###

Just run command prompt below

    install.cmd
    
Or Manuel Install

    npm install
    npm run webdriver-update
    
    
### Example Run Scripts ###
    protractor protractor.conf.js --suite=test --params.reportName=TestReport
    OR
    npm run e2e
    
### Some Useful Variables ###

reportName (string) -> Generate report you describe

isGenerateReportZip (bool) -> generated zip from report directory

sendMail (bool) -> sending mail

hasAttachmentInMail (bool) -> sending mail with html report zip file attachment


### IMPORTANT !!! ###

If you want to use async/await feature in your project, please read [this link][6]

### Dependencies ###

[Protractor (5.2.2) - E2E Framework][1]

[Web-Driver Manager (12.0.6) - Run Selenium Server][2]

[CucumberJs (3.2.1) - Behaviour-Driven Development Library ][3]

[Chai Assertion Library (4.1.2) - Validation Library][4]

[Protractor Multiple Cucumber Html Reporter (1.3.0) - E2E HTML Report][5]

[Node Mailer (4.4.2) - Sending Mail][7]

[Archiver (2.1.1) - Report File To Zip File][8]

### HAPPY E2E CODING :) ###

[1]: http://www.protractortest.org/
[2]: https://github.com/angular/webdriver-manager
[3]: https://github.com/cucumber/cucumber-js
[4]: http://chaijs.com/
[5]: https://github.com/wswebcreation/protractor-multiple-cucumber-html-reporter-plugin
[6]: https://github.com/angular/protractor/blob/master/docs/async-await.md
[7]: https://github.com/nodemailer/nodemailer
[8]: https://github.com/mholt/archiver