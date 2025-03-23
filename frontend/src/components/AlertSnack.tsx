import React from "react";
import {
  Snackbar,
  Alert,
  AlertProps,
  SnackbarProps,
  SnackbarCloseReason,
} from "@mui/material";

export interface AlertSnackProps {
  open: SnackbarProps["open"];
  handleClose: (
    event: React.SyntheticEvent<Element, Event>,
    reason?: SnackbarCloseReason
  ) => void;
  severity: AlertProps["severity"];
  message: string;
}

const AlertSnack: React.FC<AlertSnackProps> = ({
  open,
  handleClose,
  severity,
  message,
}: AlertSnackProps) => {
  return (
    <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
      <Alert
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
        onClose={handleClose}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertSnack;
