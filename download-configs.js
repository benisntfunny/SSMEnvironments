/** @format */
const AWS = require("aws-sdk");
const fs = require("fs");

(async () => {
  //@@TODO update with environment variable
  const ssm = new AWS.SSM({ region: "us-east-1" });

  params = {
    Path: "/",
    Recursive: true,
    WithDecryption: true,
  };

  const data = await ssm.getParametersByPath(params).promise();
  try {
    const accountId = data.Parameters[0].ARN.split(":")[4];
    let dir = `./configs/${accountId}`;

    if (!fs.existsSync(dir)) {
      await fs.mkdirSync(dir);
    }

    for (let i = 0; i < data.Parameters.length; i++) {
      const element = data.Parameters[i];
      const value = element.Value;
      const name = element.Name.replace(/\//g, "-");
      await fs.writeFileSync(`./configs/${accountId}/${name}.txt`, value);
    }
  } catch (err) {
    console.error(err);
  }
})();
