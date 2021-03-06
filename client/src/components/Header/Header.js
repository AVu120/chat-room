import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  // AccountCircle as AccountCircleIcon,
  // AlternateEmail as EmailAddressIcon,
  Chat as ChatIcon,
  // Edit as EditIcon,
  ExitToApp as LogoutIcon,
  Settings as SettingsIcon,
  VpnKey as PasswordIcon,
} from "@material-ui/icons";
import React, { useState } from "react";
import { Link } from "react-router-dom";
// import { deleteAccount } from "../../helpers/auth";
// import ChangeEmailAddress from "../common/ChangeEmailAddress";
// import ChangeDisplayName from "../common/chat/ChangeDisplayName";
import {
  // default as ConfirmDeleteAccountWindow,
  default as ConfirmLogOutWindow,
} from "../common/ConfirmationPrompt";
import DowndownMenu from "../common/DropdownMenu";
import ErrorMessage from "../common/PopUpMessage";
import ResetPassword from "../common/ResetPassword";
import styles from "./Header.module.css";

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
  // setUserStatus,
  isAuthenticated,
  logOut,
  setError,
}) {
  const classes = useStyles();
  const displayName = userStatus?.displayName || userStatus?.email;
  const email = userStatus?.email;
  const menuIconColor = "secondary";
  // const [
  //   showChangeDisplayNameWindow,
  //   setShowChangeDisplayNameWindow,
  // ] = useState(false);
  // const [
  //   showChangeEmailAddressWindow,
  //   setShowChangeEmailAddressWindow,
  // ] = useState(false);
  const [showResetPasswordWindow, setShowResetPasswordWindow] = useState(false);
  // const [
  //   showConfirmDeleteAccountWindow,
  //   setShowConfirmDeleteAccountWindow,
  // ] = useState(false);
  const [showConfirmLogOutWindow, setShowConfirmLogOutWindow] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  // eslint-disable-next-line

  // const toggleChangeDisplayNameWindow = () =>
  //   setShowChangeDisplayNameWindow(!showChangeDisplayNameWindow);

  // const toggleChangeEmailAddressWindow = () =>
  //   setShowChangeEmailAddressWindow(!showChangeEmailAddressWindow);

  const toggleResetPasswordWindow = () =>
    setShowResetPasswordWindow(!showResetPasswordWindow);

  // const toggleConfirmDeleteAccountWindow = () =>
  //   setShowConfirmDeleteAccountWindow(!showConfirmDeleteAccountWindow);

  const toggleLogOutConfirmationWindow = () =>
    setShowConfirmLogOutWindow(!showConfirmLogOutWindow);

  const acknowledgeErrorMessage = () => setErrorMessage(null);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Link
            to="/"
            style={{ color: "white", position: "relative", top: "4px" }}
          >
            <ChatIcon className={classes.chatIcon} />
          </Link>
          <Typography variant="h5" className={classes.title}>
            Room
          </Typography>
          {isAuthenticated && (
            <>
              <Typography variant="subtitle2" style={{ display: "flex" }}>
                <div
                  className={styles.display_name}
                >{`Display name:\u00A0`}</div>
                <strong>{displayName}</strong>
              </Typography>
              <DowndownMenu
                menuIcon={<SettingsIcon style={{ color: "white" }} />}
                iconOptions={[
                  // <EditIcon color={menuIconColor} />,
                  // <EmailAddressIcon color={menuIconColor} />,
                  <PasswordIcon color={menuIconColor} />,
                  // <AccountCircleIcon color={menuIconColor} />,
                  <LogoutIcon color={menuIconColor} />,
                ]}
                textOptions={[
                  // "Change Display Name",
                  // "Change Login Email",
                  "Reset Password",
                  // "Delete Account",
                  "Log Out",
                ]}
                onClickOptions={[
                  // toggleChangeDisplayNameWindow,
                  // toggleChangeEmailAddressWindow,
                  toggleResetPasswordWindow,
                  // toggleConfirmDeleteAccountWindow,
                  toggleLogOutConfirmationWindow,
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
      {/* <ChangeDisplayName
        open={showChangeDisplayNameWindow}
        onClose={toggleChangeDisplayNameWindow}
        displayName={displayName}
        setError={setError}
      /> */}
      {/* <ChangeEmailAddress
        open={showChangeEmailAddressWindow}
        onClose={toggleChangeEmailAddressWindow}
        email={email}
        setError={setError}
      /> */}
      {/* <ConfirmDeleteAccountWindow
        open={showConfirmDeleteAccountWindow}
        onClose={toggleConfirmDeleteAccountWindow}
        onAccept={() =>
          deleteAccount({
            setUserStatus,
            toggleConfirmDeleteAccountWindow,
            setErrorMessage,
          })
        }
        setError={setError}
        title="Are you sure you want to delete your account?"
        message="After your account has been deleted, you will automatically be directed to the login page."
      /> */}
      <ConfirmLogOutWindow
        open={showConfirmLogOutWindow}
        onClose={toggleLogOutConfirmationWindow}
        onAccept={logOut}
        setError={setError}
        title="Are you sure you want to log out?"
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
