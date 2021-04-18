import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import Home from "./pages/Home/Home";
import Chat from "./pages/Chat/Chat";
import SignUp from "./pages/SignUp/SignUp";
import LogIn from "./pages/LogIn/LogIn";
import { checkAuthStatus } from "./helpers/auth";
import PrivateRoute from "./components/common/routing/PrivateRoute";
import PublicRoute from "./components/common/routing/PublicRoute";
import "./styles.css";
import "./App.module.css";
import UserStatusNotification from "../src/components/common/status/Toast";

const UserStatusContext = React.createContext(null);

const App = () => {
  const [userStatus, setUserStatus] = useState({
    isAuthenticated: false,
    hasDeletedAccount: false,
    notificationPosition: { vertical: "top", horizontal: "right" },
    userId: null,
    email: null,
    isLoggedInWithEmailAndPw: null,
    isAllowedToUseChatroom: null,
    displayName: null,
    showNotification: false,
    notificationSeverity: "success",
    notificationText: "",
  });

  const onCloseStatusNotification = () =>
    setUserStatus((userStatus) => ({
      ...userStatus,
      showNotification: false,
      notificationSeverity: "success",
      notificationText: "",
    }));

  useEffect(() => {
    checkAuthStatus(setUserStatus);
  }, []);

  return (
    <UserStatusContext.Provider value={{ userStatus, setUserStatus }}>
      <Router>
        <Switch>
          <PublicRoute
            exact
            path="/"
            isAuthenticated={userStatus.isAuthenticated}
            component={Home}
          />
          <PrivateRoute
            path="/chat"
            isAuthenticated={userStatus.isAuthenticated}
            component={Chat}
          />
          <PublicRoute
            path="/signup"
            isAuthenticated={userStatus.isAuthenticated}
            component={SignUp}
          />
          <PublicRoute
            path="/login"
            isAuthenticated={userStatus.isAuthenticated}
            component={LogIn}
          />
        </Switch>
      </Router>
      <UserStatusNotification
        open={userStatus.showNotification}
        handleClose={onCloseStatusNotification}
        severity={userStatus.notificationSeverity}
        message={userStatus.notificationText}
        notificationPosition={userStatus.notificationPosition}
      />
    </UserStatusContext.Provider>
  );
};

export { UserStatusContext };
export default App;
