import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const ConfirmationPrompt = ({ open, onClose, onAccept, title, message }) => {
  return (
    <Dialog open={open}>
      <DialogTitle id="confirmation-prompt-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-prompt-message">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={onAccept}
          color="primary"
          autoFocus
          style={{ backgroundColor: "red", color: "white" }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationPrompt;
