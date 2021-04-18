const localStorage = window.localStorage;

export const SignUpWithEmailAndPassword = async ({
  event,
  email,
  password,
  setIsLoading,
  setUserStatus,
  setError,
}) => {
  try {
    event?.preventDefault();
    if (email && password) {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BASE_API_URL}/user/signUp`,
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
        const retrievedAuthData = {
          isAuthenticated: true,
          userId: responseJson.userId,
          email: responseJson.email,
          isLoggedInWithEmailAndPw: responseJson.isLoggedInWithEmailAndPw,
          isAllowedToUseChatroom: responseJson.isAllowedToUseChatroom,
          displayName: responseJson.displayName,
        };
        localStorage.setItem(
          "chatroomAuthData",
          JSON.stringify(retrievedAuthData)
        );
        setUserStatus((state) => ({
          ...state,
          ...retrievedAuthData,
        }));
      } else {
        const responseText = await response.text();
        setError(responseText.replace(/"/g, ""));
      }
    } else setError("Please fill in email and password fields.");
  } catch (error) {
    console.error(error);
  }
};

export const logInWithEmailAndPassword = async ({
  event,
  email,
  password,
  setIsLoading,
  setUserStatus,
  setError,
}) => {
  try {
    event.preventDefault();
    if (email && password) {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BASE_API_URL}/user/logInWithEmailAndPassword`,
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
        const retrievedAuthData = {
          isAuthenticated: true,
          userId: responseJson.userId,
          email: responseJson.email,
          isLoggedInWithEmailAndPw: responseJson.isLoggedInWithEmailAndPw,
          isAllowedToUseChatroom: responseJson.isAllowedToUseChatroom,
          displayName: responseJson.displayName,
        };
        localStorage.setItem(
          "chatroomAuthData",
          JSON.stringify(retrievedAuthData)
        );
        setUserStatus((state) => ({
          ...state,
          ...retrievedAuthData,
        }));
      } else {
        const responseText = await response.text();
        setError(responseText.replace(/"/g, ""));
      }
    } else {
      setError("Please fill in email and password fields.");
    }
  } catch (error) {
    console.error(error);
  }
};

export const logInWith3rdParty = async ({
  provider,
  setIsLoading,
  setUserStatus,
  setError,
}) => {
  try {
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
        isAllowedToUseChatroom: responseJson.isAllowedToUseChatroom,
        displayName: responseJson.displayName,
      }));
    } else {
      const responseText = await response.text();
      setError(responseText.replace(/"/g, ""));
    }
  } catch (error) {
    console.error(error);
  }
};

// Exit application.
export const logOut = async (setUserStatus) => {
  try {
    // const response = await fetch(
    //   `${process.env.REACT_APP_BASE_API_URL}/user/logout`
    // );
    // if (response.ok)
    localStorage.removeItem("chatroomAuthData");
    setUserStatus({
      isAuthenticated: false,
      hasDeletedAccount: false,
      showNotification: false,
      notificationPosition: { vertical: "top", horizontal: "right" },
      userId: null,
      email: null,
      isLoggedInWithEmailAndPw: null,
      isAllowedToUseChatroom: null,
      displayName: null,
      notificationText: "",
    });
    // else setError("Log Out failed.");
  } catch (error) {
    console.error(error);
  }
};

export const sendResetPasswordEmail = async ({
  event,
  emailValue,
  isValidEmail,
  setIsSendingResetPasswordEmail,
  setUserStatus,
  setError,
  onClose = () => {},
  showNotification = true,
  showSendingProgress = true,
}) => {
  try {
    event?.preventDefault();
    if (isValidEmail(emailValue.trim())) {
      showSendingProgress && setIsSendingResetPasswordEmail(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_BASE_API_URL
        }/user/resetPassword?email=${emailValue.trim()}`
      );
      showSendingProgress && setIsSendingResetPasswordEmail(false);
      if (response.ok)
        showNotification &&
          setUserStatus((userStatus) => ({
            ...userStatus,
            showNotification: true,
            notificationText: "Successfully sent reset password email.",
          }));
      else {
        const errorText = await response.text();
        setError(errorText.replace(/"/g, ""));
      }
      onClose();
    } else
      setError(emailValue.trim() ? "Invalid email format." : "Email required.");
  } catch (error) {
    console.error(error);
  }
};

export const changeLogInEmail = (newEmail) => {
  try {
    fetch(
      `${process.env.REACT_APP_BASE_API_URL}/user/changeLogInEmail?newEmail=${newEmail}`
    );
  } catch (error) {
    console.error(error);
  }
};

export const checkAuthStatus = (setUserStatus) => {
  try {
    // const response = await fetch(
    //   `${process.env.REACT_APP_BASE_API_URL}/user/status`
    // );
    // if (response.ok) {
    // const responseJson = await response.json();
    const retrievedAuthData = JSON.parse(
      localStorage.getItem("chatroomAuthData")
    );
    if (retrievedAuthData)
      setUserStatus((state) => ({
        ...state,
        ...retrievedAuthData,
      }));
    // } else {
    //   setUserStatus((state) => ({ ...state, isAuthenticated: false }));
    // }
  } catch (error) {
    console.error(error);
  }
};

export const deleteAccount = async ({
  setUserStatus,
  toggleDeleteAccountPrompt,
  setErrorMessage,
}) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_API_URL}/user/account`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      localStorage.removeItem("chatroomAuthData");
      setUserStatus((userStatus) => ({
        ...userStatus,
        isAuthenticated: false,
        hasDeletedAccount: true,
        userId: null,
        email: null,
        isLoggedInWithEmailAndPw: null,
        isAllowedToUseChatroom: null,
        showNotification: true,
        notificationSeverity: "success",
        notificationText: "Successfully deleted account.",
      }));
    } else {
      toggleDeleteAccountPrompt();
      const error = await response.text();
      setErrorMessage(error);
    }
  } catch (error) {
    console.error("CONSOLED ERROR:", error);
  }
};

export const changeDisplayName = async ({
  event,
  draftDisplayName,
  displayName,
  setIsChangingDisplayName,
  setUserStatus,
  onClose,
  setError,
}) => {
  event?.preventDefault();
  if (draftDisplayName && draftDisplayName !== displayName) {
    setIsChangingDisplayName(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_API_URL}/user/displayName`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ draftDisplayName }),
        }
      );
      if (response.ok) {
        setUserStatus((userStatus) => ({
          ...userStatus,
          displayName: draftDisplayName,
        }));
        setIsChangingDisplayName(false);
        onClose();
      } else {
        const errorText = await response.text();
        throw new Error(errorText);
      }
    } catch (error) {
      console.error(error);
      setError(error);
    }
  } else if (draftDisplayName === displayName) onClose();
  else alert("Cannot save an empty display name.");
};
