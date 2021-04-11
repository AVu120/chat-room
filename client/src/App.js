import React, { useState, useEffect } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
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
    notificationText: "",
  });

  const onCloseStatusNotification = () =>
    setUserStatus((state) => ({
      ...state,
      hasDeletedAccount: false,
      userId: null,
      email: null,
      isLoggedInWithEmailAndPw: null,
      isAllowedToUseChatroom: null,
      displayName: null,
      showNotification: false,
      notificationText: "",
    }));

  useEffect(() => {
    checkAuthStatus(setUserStatus);
  }, []);

  return (
    <UserStatusContext.Provider value={{ userStatus, setUserStatus }}>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <PrivateRoute
            path="/chat"
            authenticated={userStatus.isAuthenticated}
            component={Chat}
          />
          <PublicRoute
            path="/signup"
            authenticated={userStatus.isAuthenticated}
            component={SignUp}
          />
          <PublicRoute
            path="/login"
            authenticated={userStatus.isAuthenticated}
            component={LogIn}
          />
        </Switch>
      </Router>
      <UserStatusNotification
        open={userStatus.showNotification}
        handleClose={onCloseStatusNotification}
        severity="success"
        message={userStatus.notificationText}
        notificationPosition={userStatus.notificationPosition}
      />
    </UserStatusContext.Provider>
  );
};

export { UserStatusContext };
export default App;
