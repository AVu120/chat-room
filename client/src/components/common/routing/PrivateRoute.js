import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, authenticated }) => {
  return (
    <Route
      render={(props) =>
        authenticated === true ? (
          <Component authenticated={authenticated} {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
