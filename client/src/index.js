import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { Amplify } from "aws-amplify";
import { config } from "./aws-exports";

Amplify.configure(config);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <UserProvider>
    <Router>
      <App />
    </Router>
  </UserProvider>
);
