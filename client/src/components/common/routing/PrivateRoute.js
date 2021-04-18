import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, isAuthenticated }) => (
  <Route>
    {isAuthenticated ? (
      <Component isAuthenticated={isAuthenticated} />
    ) : (
      <Redirect to="/login" />
    )}
  </Route>
);

export default PrivateRoute;
