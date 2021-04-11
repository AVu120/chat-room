// All functions related to firebase sdk authentication here.
import { auth } from "../services/firebase";

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
  else setError("Log out failed.");
};

// Change account details.
export const resetPassword = (email) => auth().sendPasswordResetEmail(email);

export const changeEmailAddress = (newEmail) =>
  fetch(
    `${process.env.REACT_APP_BASE_API_URL}/user/changeEmailAddress?newEmail=${newEmail}`
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
