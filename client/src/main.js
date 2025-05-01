import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App'; // Import your App component
import { UserProvider } from './contexts/UserContext'; // Import UserProvider

// Wrap your app with UserProvider to give access to user context
ReactDOM.render(
  <UserProvider>
    <Router>
      <App />
    </Router>
  </UserProvider>,
  document.getElementById('root')
);
