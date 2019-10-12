import React, { useState } from "react";
import { Fragment } from "react";
import { Snackbar, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { amber } from "@material-ui/core/colors";
import ErrorIcon from "@material-ui/icons/Error";

import CloseIcon from "@material-ui/icons/Close";

const Error = ({ error }) => {
  const [open, setOpen] = useState(true);
  return (
    <Snackbar
      open={open}
      message={error.message}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
      }}
      action={
        <Button onClick={() => setOpen(false)} size="small">
          Close
        </Button>
      }
    />
  );
};

export default Error;
