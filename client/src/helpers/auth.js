// All functions related to firebase sdk authentication here.
import { auth } from "../services/firebase";

export const logInWithEmailAndPassword = async ({
  event,
  email,
  password,
  setIsLoading,
  setUserStatus,
  setError,
}) => {
  event.preventDefault();
  if (email && password) {
    setIsLoading(true);
    const response = await fetch(
      `${process.env.REACT_APP_BASE_API_URL}/user/loginWithEmailAndPassword`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );
    setIsLoading(false);
    if (response.ok) {
      const responseJson = await response.json();
      setUserStatus((state) => ({
        ...state,
        isAuthenticated: true,
        userId: responseJson.userId,
        email: responseJson.email,
        isLoggedInWithEmailAndPw: responseJson.isLoggedInWithEmailAndPw,
        isVerifiedToUseChatroom: responseJson.isVerifiedToUseChatroom,
        displayName: responseJson.displayName,
      }));
    } else {
      const responseText = await response.text();
      setError(responseText.replace(/"/g, ""));
    }
  } else {
    setError("Please fill in email and password fields.");
  }
};

export const logInWith3rdParty = async ({
  provider,
  setIsLoading,
  setUserStatus,
  setError,
}) => {
  setIsLoading(true);
  const response = await fetch(
    `${process.env.REACT_APP_BASE_API_URL}/user/logInWith3rdParty?provider=${provider}`
  );
  setIsLoading(false);
  if (response.ok) {
    const responseJson = await response.json();
    setUserStatus((state) => ({
      ...state,
      isAuthenticated: true,
      userId: responseJson.userId,
      email: responseJson.email,
      isLoggedInWithEmailAndPw: responseJson.isLoggedInWithEmailAndPw,
      isVerifiedToUseChatroom: responseJson.isVerifiedToUseChatroom,
      displayName: responseJson.displayName,
    }));
  } else {
    const responseText = await response.text();
    setError(responseText.replace(/"/g, ""));
  }
};

// Exit application.
export const logOut = async (setUserStatus, setError) => {
  const response = await fetch(
    `${process.env.REACT_APP_BASE_API_URL}/user/logout`
  );
  if (response.ok)
    setUserStatus({
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
  else setError("Log Out failed.");
};

// Change account details.
export const resetPassword = (email) =>
  fetch(
    `${process.env.REACT_APP_BASE_API_URL}/user/resetPassword?email=${email}`
  );

export const changeLogInEmail = (newEmail) =>
  fetch(
    `${process.env.REACT_APP_BASE_API_URL}/user/changeLogInEmail?newEmail=${newEmail}`
  );

export const checkAuthStatus = async (setUserStatus) => {
  const response = await fetch(
    `${process.env.REACT_APP_BASE_API_URL}/user/status`
  );
  if (response.ok) {
    const responseJson = await response.json();
    console.log({ responseJson });
    setUserStatus((state) => ({
      ...state,
      isAuthenticated: true,
      ...responseJson,
    }));
  } else {
    setUserStatus((state) => ({ ...state, isAuthenticated: false }));
  }
};
