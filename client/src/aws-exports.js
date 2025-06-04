// src/aws-exports.js
export const config = {
  Auth: {
    Cognito: {
      userPoolId: "us-east-2_qNjhtqnaC",
      userPoolClientId: "cvprj4cqhl4h6kjsaaem962jf",
      loginWith: {
        oauth: {
          domain: "us-east-2qnjhtqnac.auth.us-east-2.amazoncognito.com",
          scopes: ["email", "openid", "profile"],
          redirectSignIn: ["http://localhost:3000/auth/callback"],
          redirectSignOut: ["http://localhost:3000/"],
          responseType: "code",
        },
      },
    },
  },
};
