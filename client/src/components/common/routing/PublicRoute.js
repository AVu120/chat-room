import React from "react";
import { Route, Redirect } from "react-router-dom";

const PublicRoute = ({ component: Component, authenticated }) => {
  return (
    <Route
      render={(props) =>
        !authenticated ? <Component {...props} /> : <Redirect to="/chat" />
      }
    />
  );
};

export default PublicRoute;
