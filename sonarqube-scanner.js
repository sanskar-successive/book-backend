const scanner = require("sonarqube-scanner");
const userToken='squ_3f37b9d4203c8a40200810f2907b2c415062c637'
scanner(
  {
    serverUrl: "http://localhost:9000",
   
    token: userToken,
    options: {
      "sonar.sources": "./src",
    },
  },
  () => process.exit()
);