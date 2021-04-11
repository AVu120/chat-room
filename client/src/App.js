import React, { useState, useEffect } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Home from "./pages/Home/Home";
import Chat from "./pages/Chat/Chat";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
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
    showNotification: false,
    notificationPosition: { vertical: "top", horizontal: "right" },
    userId: null,
    email: null,
    isLoggedInWithEmailAndPw: null,
    isVerifiedToUseChatroom: null,
    displayName: null,
    notificationText: "",
  });

  const onCloseStatusNotification = () =>
    setUserStatus((state) => ({
      ...state,
      hasDeletedAccount: false,
      showNotification: false,
      notificationText: "",
      userId: null,
      email: null,
      isLoggedInWithEmailAndPw: null,
      isVerifiedToUseChatroom: null,
      displayName: null,
    }));

  // useEffect(() => {
  //   // auth().onAuthStateChanged() fires whenever firebase authentication state changes.
  //   const subscribe = () =>
  //     auth().onAuthStateChanged((user) => {
  //       // console.log({ user });
  //       // user is defined if the user is authenticated.
  //       if (user) {
  //         setUserStatus((state) => ({ ...state, isAuthenticated: true }));
  //         // user is null if user is unauthenticated.
  //       } else {
  //         setUserStatus((state) => ({ ...state, isAuthenticated: false }));
  //       }
  //     });

  //   // Clean up firebase authentication status listener on unmount.
  //   return subscribe();
  // }, []);

  useEffect(() => {
    // const checkAuthStatus = async () => {
    //   const response = await fetch(
    //     `${process.env.REACT_APP_BASE_API_URL}/user/status`
    //   );
    //   if (response.ok) {
    //     const responseJson = await response.json();
    //     console.log({ responseJson });

    //     setUserStatus((state) => ({
    //       ...state,
    //       isAuthenticated: true,
    //       ...responseJson,
    //     }));
    //   } else {
    //     setUserStatus((state) => ({ ...state, isAuthenticated: false }));
    //   }
    // };
    checkAuthStatus(setUserStatus);
  }, []);

  return (
    <UserStatusContext.Provider value={[userStatus, setUserStatus]}>
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
