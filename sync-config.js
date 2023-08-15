/** @format */

process.env.AWS_SDK_LOAD_CONFIG = 1;
const fs = require("fs");

const { STS } = require("aws-sdk");

(async () => {
  if (process.argv.length < 3) {
    console.log("Please name of config file");
    return;
  }
  let configName = process.argv[2];

  try {
    const sts = new STS();
    const { Account: account } = await sts.getCallerIdentity({}).promise();
    const file = `./configs/${account}/${configName}.txt`;

    if (await !fs.existsSync(file)) {
      console.log("File not found");
      return;
    }
    const Value = await fs.readFileSync(file, "utf8");
    configName = configName.replace("-", "/");

    const { SSM } = require("aws-sdk");
    const ssm = new SSM({ region: "us-east-1" });
    const params = {
      Name: configName,
      Value,
      Overwrite: true,
      Type: "String",
    };
    const data = await ssm.putParameter(params).promise();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
})();
