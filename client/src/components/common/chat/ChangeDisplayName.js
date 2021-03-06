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
import { changeDisplayName } from "../../../helpers/auth";
import { UserStatusContext } from "../../../App";

const useStyles = makeStyles((theme) => ({
  cancelButton: {},
  saveButton: {},
  loadingIcon: { margin: "0 10px 10px 0" },
  dialogContentText: { marginBottom: "-5px", marginTop: "-5px" },
}));

export default function ChangeDisplayName({
  open,
  onClose,
  displayName,
  setError,
}) {
  const { setUserStatus } = useContext(UserStatusContext);
  const classes = useStyles();
  const [isChangingDisplayName, setIsChangingDisplayName] = useState(false);
  const [draftDisplayName, setDraftDisplayName] = useState(displayName);

  return (
    <div>
      <Dialog open={open} keepMounted>
        <form
          onSubmit={(event) =>
            changeDisplayName({
              event,
              draftDisplayName,
              displayName,
              setIsChangingDisplayName,
              setUserStatus,
              onClose,
              setError,
            })
          }
        >
          <DialogTitle id="alert-dialog-slide-title">
            {"Edit Your Display Name"}
          </DialogTitle>
          <DialogContent>
            <p className={classes.dialogContentText}>
              Everyone in this chatroom will see you as this.
            </p>
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
