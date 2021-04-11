import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { resetPassword } from "../../helpers/auth";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { UserStatusContext } from "../../App";

const useStyles = makeStyles((theme) => ({
  cancelButton: {},
  saveButton: {},
  loadingIcon: { margin: "0 10px 10px 0" },
}));

export default function ResetPassword({
  open,
  onClose,
  email,
  setError,
  forgot,
}) {
  const classes = useStyles();
  const [emailValue, setEmailValue] = useState(!forgot ? email : "");
  const [
    isSendingResetPasswordEmail,
    setIsSendingResetPasswordEmail,
  ] = useState(false);
  const { setUserStatus } = useContext(UserStatusContext);

  const sendResetPasswordEmail = async (event) => {
    event.preventDefault();
    setIsSendingResetPasswordEmail(true);
    const response = await resetPassword(emailValue);
    setIsSendingResetPasswordEmail(false);
    if (response.ok)
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
  };

  const onAcknowledgeResetEmailSent = async (event) => {
    event.preventDefault();
    onClose();
  };

  useEffect(() => {
    if (!open || forgot) return;
    sendResetPasswordEmail();
    // eslint-disable-next-line
  }, [open]);

  const ResetPasswordEmailSentMessage = () => (
    <>
      <DialogContent>
        <p>A reset password email has been sent to your email inbox.</p>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" variant="contained" type="submit">
          OK
        </Button>
      </DialogActions>
    </>
  );

  return (
    <div>
      <Dialog open={open} keepMounted>
        <DialogTitle id="alert-dialog-slide-title">Reset Password</DialogTitle>
        {forgot ? (
          <form onSubmit={sendResetPasswordEmail}>
            <DialogContent>
              <p>Enter your email address:</p>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                onChange={(e) => setEmailValue(e.target.value)}
                autoFocus
                value={emailValue}
                autoComplete="email"
                type="email"
                required
              />
            </DialogContent>
            <DialogActions
              className={`${
                isSendingResetPasswordEmail ? classes.loadingIcon : ""
              }`}
            >
              {isSendingResetPasswordEmail ? (
                <CircularProgress color="secondary" />
              ) : (
                <>
                  <Button
                    onClick={() => onClose()}
                    color="primary"
                    variant="contained"
                    className={classes.cancelButton}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="secondary"
                    variant="contained"
                    className={classes.saveButton}
                    onClick={sendResetPasswordEmail}
                  >
                    Save
                  </Button>
                </>
              )}
            </DialogActions>
          </form>
        ) : (
          <form onSubmit={onAcknowledgeResetEmailSent}>
            {ResetPasswordEmailSentMessage()}
          </form>
        )}
      </Dialog>
    </div>
  );
}
