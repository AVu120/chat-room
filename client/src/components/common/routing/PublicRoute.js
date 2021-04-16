import React from "react";
import { Route, Redirect } from "react-router-dom";

const PublicRoute = ({ component: Component, isAuthenticated }) => {
  return (
    <Route
      render={(props) =>
        !isAuthenticated ? <Component {...props} /> : <Redirect to="/chat" />
      }
    />
  );
};

export default PublicRoute;
