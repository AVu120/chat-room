// All functions related to firebase sdk authentication here.
import { auth } from "../services/firebase";

// Create application account.
export const signUp = (email, password) =>
  auth().createUserWithEmailAndPassword(email, password);

export const sendVerificationEmail = () =>
  auth().currentUser.sendEmailVerification();

export const authenticateWithGoogle = () => {
  const provider = new auth.GoogleAuthProvider();
  return auth().signInWithPopup(provider);
};

export const authenticateWithGitHub = () => {
  const provider = new auth.GithubAuthProvider();
  return auth().signInWithPopup(provider);
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
  else setError("Log out failed.");
};

// Change account details.
export const resetPassword = (email) => auth().sendPasswordResetEmail(email);

export const changeEmailAddress = (newEmail) =>
  auth().currentUser.updateEmail(newEmail);

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
