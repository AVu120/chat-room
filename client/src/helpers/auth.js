export const SignUpWithEmailAndPassword = async ({
  event,
  email,
  password,
  setIsLoading,
  setUserStatus,
  setError,
}) => {
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
  } else setError("Please fill in email and password fields.");
};

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
      isAllowedToUseChatroom: responseJson.isAllowedToUseChatroom,
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
      isAllowedToUseChatroom: null,
      displayName: null,
      notificationText: "",
    });
  else setError("Log Out failed.");
};

export const sendResetPasswordEmail = async ({
  event,
  emailValue,
  isValidEmail,
  setIsSendingResetPasswordEmail,
  setUserStatus,
  setError,
  onClose,
  showNotification = true,
  showSendingProgress = true,
}) => {
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
};

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
