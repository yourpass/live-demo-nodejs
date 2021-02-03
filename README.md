# Live demo

## Parse system enviroments wit secrets

```(javascript)
const Dotenv = require("dotenv");
Dotenv.config();
```

## Prepare oAuth Client

```(javascript)
const ClientOAuth2 = require("client-oauth2");

const salesToolAuth = new ClientOAuth2({
  clientId: process.env.OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_SECRET,
  accessTokenUri: process.env.OAUTH_URI,
});
```

## Get and manage access token

```(javascript)
let token = null;
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
```

## Create pass

```(javascript)
const createPass = async (templateID, name, points) => {
  const res = await fetch(`${process.env.BASE_URI}/v1/pass`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${(await getToken()).accessToken}`,
    },
    body: JSON.stringify({ templateId: templateID, dynamicData: { name, points } }),
  });
  if (res.status === 201) {
    return await res.json();
  }
  throw new Error("Couldn't create pass");
};
```

## Patch pass

```(javascript)
const patchPass = async (passId, points) => {
  const res = await fetch(`${process.env.BASE_URI}/v1/pass/${passId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${(await getToken()).accessToken}`,
    },
    body: JSON.stringify({ dynamicData: { points } }),
  });
  if (res.status === 200) {
    return await res.json();
  }
  throw new Error("Couldn't patch pass");
};
```

## List pass by temlate

```(javascript)
const listPassByTemplate = async (templateId) => {
  const url = `${process.env.BASE_URI}/v1/pass?where={"deletedAt":null,"templateId":{"$inUuid":["${templateId}"]}}&page=1&limit=100&order=desc&orderBy=updatedAt&suppressCount`;
  console.log(url)
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${(await getToken()).accessToken}`,
    },
  });
  if (res.status === 200) {
    return await res.json();
  }
  throw new Error("Couldn't list pass");
};
```
