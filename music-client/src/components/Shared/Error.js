import React, { useState } from "react";
import { Snackbar, Button } from "@material-ui/core";

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
