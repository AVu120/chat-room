import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, isAuthenticated }) => {
  return (
    <Route
      render={(props) =>
        isAuthenticated === true ? (
          <Component isAuthenticated={isAuthenticated} {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
