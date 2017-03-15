exports.config = {
    specs: [
        // './e2e/helpers/*/.js',
        // './e2e/**/*.js',
        // './e2e/cars/profileData.js',
        './e2e/drivers/addDriver.js'
    ],

    multipleCapabilities: [{
        browserName: 'chrome',
        "chromeOptions": {
            binary: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        }
    }, {
        browserName: 'firefox'
    }],
    baseUrl: 'http://localhost:3000/',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    framework: 'jasmine',
    jasmineNodeOpts: {
        showColors: true
    }
};