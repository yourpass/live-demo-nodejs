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
const createPass = async (templateID, name, points) => {
  const res = await fetch(`${process.env.BASE_URI}/v1/pass`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${(await getToken()).accessToken}`,
    },
    body: JSON.stringify({
      templateId: templateID,
      dynamicData: { name, points },
    }),
  });
  if (res.status === 201) {
    return await res.json();
  }
  throw new Error("Couldn't create pass");
};

async function run() {
  console.log("create pass");
  const pass = await createPass(process.env.TEMPLATE_ID, "Some name", 5);
  console.log(pass);
}

run();
