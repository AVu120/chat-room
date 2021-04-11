import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { auth } from "../../../services/firebase";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  cancelButton: {},
  saveButton: {},
  loadingIcon: { margin: "0 10px 10px 0" },
}));

export default function ChangeDisplayName({
  open,
  onClose,
  setDisplayName,
  displayName,
  setError,
}) {
  const classes = useStyles();
  const [isChangingDisplayName, setIsChangingDisplayName] = useState(false);
  const [draftDisplayName, setDraftDisplayName] = useState(displayName);

  const onSave = (event) => {
    event.preventDefault();
    if (draftDisplayName && draftDisplayName !== displayName) {
      setIsChangingDisplayName(true);
      auth()
        .currentUser.updateProfile({
          displayName: draftDisplayName,
        })
        .then(() => {
          setIsChangingDisplayName(false);
          setDisplayName(draftDisplayName);
          onClose();
        })
        .catch((error) => {
          console.error(error);
          setError(error.message);
        });
    } else if (draftDisplayName === displayName) onClose();
    else alert("Cannot save an empty display name.");
  };
  return (
    <div>
      <Dialog open={open} keepMounted>
        <form onSubmit={onSave}>
          <DialogTitle id="alert-dialog-slide-title">
            {"Edit Your Display Name"}
          </DialogTitle>
          <DialogContent>
            <p>Everyone in this chatroom will see this.</p>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              onChange={(e) => setDraftDisplayName(e.target.value)}
              autoFocus
              value={draftDisplayName}
            />
          </DialogContent>
          <DialogActions
            className={`${isChangingDisplayName ? classes.loadingIcon : ""}`}
          >
            {isChangingDisplayName ? (
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
