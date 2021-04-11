import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Chat as ChatIcon,
  Edit as EditIcon,
  ExitToApp as LogoutIcon,
  Settings as SettingsIcon,
  VpnKey as PasswordIcon,
  AlternateEmail as EmailAddressIcon,
  AccountCircle as AccountCircleIcon,
} from "@material-ui/icons";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import DowndownMenu from "../common/DropdownMenu";
import ResetPassword from "./ResetPassword";
import ChangeDisplayName from "../common/chat/ChangeDisplayName";
import ChangeEmailAddress from "../common/ChangeEmailAddress";
import ConfirmDeleteAccountPrompt from "../common/ConfirmationPrompt";
import ErrorMessage from "../../components/common/PopUpMessage";
import { auth } from "../../services/firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: 0,
  },
  toolbar: {},
  title: {
    flexGrow: 1,
    color: "white",
  },
  editIcon: {
    marginLeft: 5,
    marginRight: 10,
  },
  chatIcon: {
    marginRight: 10,
    alignSelf: "center",
  },
  button: {
    color: "white",
  },
}));

export default function Header({
  userStatus,
  setUserStatus,
  authenticated,
  setDisplayName,
  logOut,
  setError,
}) {
  const classes = useStyles();
  const displayName = userStatus?.displayName || userStatus?.email;
  const email = userStatus?.email;
  const menuIconColor = "secondary";
  const [
    showChangeDisplayNameWindow,
    setShowChangeDisplayNameWindow,
  ] = useState(false);
  const [
    showChangeEmailAddressWindow,
    setShowChangeEmailAddressWindow,
  ] = useState(false);
  const [showResetPasswordWindow, setShowResetPasswordWindow] = useState(false);
  const [showConfirmationPrompt, setShowConfirmationPrompt] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  // eslint-disable-next-line

  const toggleChangeDisplayNameWindow = () =>
    setShowChangeDisplayNameWindow(!showChangeDisplayNameWindow);

  const toggleChangeEmailAddressWindow = () =>
    setShowChangeEmailAddressWindow(!showChangeEmailAddressWindow);

  const toggleResetPasswordWindow = () =>
    setShowResetPasswordWindow(!showResetPasswordWindow);

  const toggleDeleteAccountPrompt = () =>
    setShowConfirmationPrompt(!showConfirmationPrompt);

  const acknowledgeErrorMessage = () => setErrorMessage(null);
  const onDeleteAccount = async () => {
    auth()
      .currentUser.delete()
      .then(() => {
        setUserStatus((state) => ({
          ...state,
          hasDeletedAccount: true,
          showNotification: true,
          text: "Your account has been deleted.",
        }));
      })
      .catch((deleteError) => {
        toggleDeleteAccountPrompt();
        deleteError && setErrorMessage(deleteError.message);
      });
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <ChatIcon className={classes.chatIcon} />
          <Typography variant="h5" className={classes.title}>
            Room
          </Typography>
          {authenticated && (
            <>
              <Typography variant="subtitle2">
                {`Display name is `}
                <strong>{displayName}</strong>
              </Typography>
              <DowndownMenu
                menuIcon={<SettingsIcon style={{ color: "white" }} />}
                iconOptions={[
                  <EditIcon color={menuIconColor} />,
                  <EmailAddressIcon color={menuIconColor} />,
                  <PasswordIcon color={menuIconColor} />,
                  <AccountCircleIcon color={menuIconColor} />,
                  <LogoutIcon color={menuIconColor} />,
                ]}
                textOptions={[
                  "Change Display Name",
                  "Change email address",
                  "Change password",
                  "Delete account",
                  "Log out",
                ]}
                onClickOptions={[
                  toggleChangeDisplayNameWindow,
                  toggleChangeEmailAddressWindow,
                  toggleResetPasswordWindow,
                  toggleDeleteAccountPrompt,
                  logOut,
                ]}
              />
            </>
          )}
        </Toolbar>
      </AppBar>
      <ResetPassword
        open={showResetPasswordWindow}
        onClose={setShowResetPasswordWindow}
        setError={setError}
        email={email}
      />
      <ChangeDisplayName
        open={showChangeDisplayNameWindow}
        onClose={toggleChangeDisplayNameWindow}
        setDisplayName={setDisplayName}
        displayName={displayName}
        setError={setError}
      />
      <ChangeEmailAddress
        open={showChangeEmailAddressWindow}
        onClose={toggleChangeEmailAddressWindow}
        email={email}
        setError={setError}
      />
      <ConfirmDeleteAccountPrompt
        open={showConfirmationPrompt}
        onClose={toggleDeleteAccountPrompt}
        onAccept={onDeleteAccount}
        setError={setError}
        title="Are you sure you want to delete your account?"
        message="After your account has been deleted, you will be automatically directed to the login page."
      />
      <ErrorMessage
        title="Error"
        message={errorMessage}
        open={Boolean(errorMessage)}
        handleClose={acknowledgeErrorMessage}
      />
    </div>
  );
}
