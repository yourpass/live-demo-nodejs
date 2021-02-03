const Dotenv = require("dotenv");

Dotenv.config();

async function run() {
  console.log("loaded env:");
  console.log(process.env);
}

run();
