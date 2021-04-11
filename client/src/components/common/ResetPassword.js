import React, { useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { resetPassword } from "../../helpers/auth";

export default function ResetPassword({ open, onClose, email, setError }) {
  const onAcknowledgeResetEmailSent = (event) => {
    event.preventDefault();
    onClose(false);
  };

  useEffect(() => {
    if (!open) return;
    try {
      resetPassword(email);
    } catch (error) {
      error && setError(error.message);
    }
    // eslint-disable-next-line
  }, [open]);

  return (
    <div>
      <Dialog open={open} keepMounted>
        <DialogTitle id="alert-dialog-slide-title">Reset Password</DialogTitle>

        <form onSubmit={onAcknowledgeResetEmailSent}>
          <DialogContent>
            <p>A reset password email has been sent to your email inbox.</p>
          </DialogContent>
          <DialogActions>
            <Button color="secondary" variant="contained" type="submit">
              OK
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
