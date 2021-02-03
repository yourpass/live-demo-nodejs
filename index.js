const ClientOAuth2 = require("client-oauth2");
const Dotenv = require("dotenv");
const fetch = require("node-fetch");

Dotenv.config();

let token = null;

const salesToolAuth = new ClientOAuth2({
  clientId: process.env.OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_SECRET,
  accessTokenUri: process.env.OAUTH_URI,
});

async function getToken() {
  if (token !== null && !token.expired()) {
    return token;
  }

  const json = await salesToolAuth.owner.getToken(
    process.env.AUTH_USER || "",
    process.env.AUTH_PASSWORD || ""
  );

  token = json;
  return json;
}

async function run() {
  console.log("get access token");
  console.log((await getToken()).accessToken);
}

run();
