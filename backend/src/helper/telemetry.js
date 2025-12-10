const appInsights = require("applicationinsights");

const connString = process.env.APPINSIGHTS_CONNECTION_STRING;

if (connString) {
    appInsights
        .setup(connString)
        .setAutoDependencyCorrelation(true)
        .setAutoCollectRequests(true)
        .setAutoCollectPerformance(true)
        .setAutoCollectExceptions(true)
        .setAutoCollectDependencies(true)
        .setAutoCollectConsole(true)
        .setUseDiskRetryCaching(true)
        .start();

    console.log("Application Insights enabled");
} else {
    console.log("APPINSIGHTS_CONNECTION_STRING not set; telemetry disabled");
}
