import React, { useState, useContext } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { changeLogInEmail } from "../../helpers/auth";
import { UserStatusContext } from "../../App";

const useStyles = makeStyles((theme) => ({
  cancelButton: {},
  saveButton: {},
  loadingIcon: { margin: "0 10px 10px 0" },
}));

export default function ChangeEmailAddress({ open, onClose, email, setError }) {
  const classes = useStyles();
  const [isChangingEmailAddress, setIsChangingEmailAddress] = useState(false);
  const [draftEmailAddress, setDraftEmailAddress] = useState(email);
  const { setUserStatus } = useContext(UserStatusContext);

  async function onSave(event) {
    event.preventDefault();
    if (draftEmailAddress && draftEmailAddress !== email)
      try {
        setIsChangingEmailAddress(true);
        await changeLogInEmail(draftEmailAddress);
        setIsChangingEmailAddress(false);
        setUserStatus((userStatus) => ({
          ...userStatus,
          showNotification: true,
          notificationText: "Successfully changed login email.",
        }));
        onClose();
      } catch (error) {
        console.error(error);
        setError(error.message);
        setIsChangingEmailAddress(false);
      }
    else if (draftEmailAddress === email) onClose();
  }

  return (
    <div>
      <Dialog open={open} keepMounted>
        <form onSubmit={onSave}>
          <DialogTitle id="alert-dialog-slide-title">
            Change Login Email
          </DialogTitle>
          <DialogContent>
            <p>Type your new login email address.</p>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              onChange={(e) => setDraftEmailAddress(e.target.value)}
              autoFocus
              value={draftEmailAddress}
              autoComplete="email"
              required
            />
          </DialogContent>
          <DialogActions
            className={`${isChangingEmailAddress ? classes.loadingIcon : ""}`}
          >
            {isChangingEmailAddress ? (
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
                  type="submit"
                >
                  Save
                </Button>
              </>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
