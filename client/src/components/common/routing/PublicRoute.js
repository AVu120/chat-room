import React from "react";
import { Route, Redirect } from "react-router-dom";

const PublicRoute = ({ component: Component, isAuthenticated }) => (
  <Route>
    {!isAuthenticated ? (
      <Component isAuthenticated={isAuthenticated} />
    ) : (
      <Redirect to="/chat" />
    )}
  </Route>
);

export default PublicRoute;
