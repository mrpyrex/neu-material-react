import React from "react";
import { Fragment } from "react";
import { Snackbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { amber } from "@material-ui/core/colors";
import ErrorIcon from "@material-ui/icons/Error";

import CloseIcon from "@material-ui/icons/Close";

const variantIcon = {
  error: ErrorIcon
};

const useStyles1 = makeStyles(theme => ({
  error: {
    backgroundColor: theme.palette.error.dark
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: "flex",
    alignItems: "center"
  }
}));
const Error = ({ error }) => {
  return (
    <Snackbar
      className={classes.snackbar}
      message={error.message}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
      }}
    />
  );
};

export default Error;
