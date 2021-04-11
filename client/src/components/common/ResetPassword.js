import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { sendResetPasswordEmail } from "../../helpers/auth";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { UserStatusContext } from "../../App";
import { isValidEmail } from "../../helpers/validation";

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

  const onAcknowledgeResetEmailSent = async (event) => {
    event.preventDefault();
    onClose();
  };

  useEffect(() => {
    if (!open || forgot) return;
    sendResetPasswordEmail({
      emailValue,
      isValidEmail,
      setIsSendingResetPasswordEmail,
      setUserStatus,
      setError,
      onClose,
      showNotification: false,
      showSendingProgress: false,
    });
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
          <form
            onSubmit={(event) =>
              sendResetPasswordEmail({
                event,
                emailValue,
                isValidEmail,
                setIsSendingResetPasswordEmail,
                setUserStatus,
                setError,
                onClose,
              })
            }
          >
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
                    onClick={(event) =>
                      sendResetPasswordEmail({
                        event,
                        emailValue,
                        isValidEmail,
                        setIsSendingResetPasswordEmail,
                        setUserStatus,
                        setError,
                        onClose,
                      })
                    }
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
