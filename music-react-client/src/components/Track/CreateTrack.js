import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import axios from "axios";

import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import { FormControl, Button, TextField } from "@material-ui/core";
import Error from "../Shared/Error";

const useStyles = makeStyles(theme => ({
  fab: {
    margin: theme.spacing(1)
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  }
}));

export default function CreateTrack() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAudio = event => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleAudioUpload = async () => {
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("resource_type", "raw");
      data.append("upload_preset", "pyrexmusic");
      data.append("cloud_name", "neupytech");

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/neupytech/raw/upload",
        data
      );
      return res.data.url;
    } catch (error) {
      console.error("Error uploading file", error);
      setSubmitting(false);
    }
  };

  const handleSubmit = async (event, createTrack) => {
    event.preventDefault();
    setSubmitting(true);
    const uploadUrl = await handleAudioUpload();
    createTrack({ title, description, url: uploadUrl });
  };

  const classes = useStyles();
  return (
    <Fragment>
      <Fab
        onClick={() => setOpen(true)}
        color="primary"
        aria-label="add"
        className={classes.fab}
      >
        {open ? <ClearIcon /> : <AddIcon />}
      </Fab>

      <Mutation
        mutation={CREATE_TRACK_MUTATION}
        onCompleted={data => {
          setSubmitting(false);
          setOpen(false);
        }}
      >
        {(createTrack, { loading, error }) => {
          if (error) return <Error error={error} />;
          return (
            <Dialog open={open}>
              <form onSubmit={event => handleSubmit(event, createTrack)}>
                <DialogTitle>Create Track</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Add a Title, Description & Audio File
                  </DialogContentText>
                  <div>
                    <FormControl fullWidth>
                      <TextField
                        onChange={event => setTitle(event.target.value)}
                        label="Title"
                        placeholder="Add Title"
                      />
                    </FormControl>
                  </div>
                  <div>
                    <FormControl fullWidth>
                      <TextField
                        onChange={event => setDescription(event.target.value)}
                        multiline
                        rows="2"
                        label="Description"
                        placeholder="Add Description"
                      />
                    </FormControl>
                  </div>
                  <div>
                    <FormControl>
                      <input
                        accept="audio/mp3, audio/wav"
                        id="audio"
                        required
                        type="file"
                        className={classes.input}
                        onChange={handleAudio}
                      />
                      <label htmlFor="audio">
                        <Button variant="outlined" component="span">
                          Audio file
                          <MusicNoteIcon />
                        </Button>
                        {file && file.name}
                      </label>
                    </FormControl>
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button
                    disabled={submitting}
                    color="primary"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={
                      submitting ||
                      !title.trim() ||
                      !description.trim() ||
                      !file
                    }
                    type="submit"
                  >
                    Add Track
                  </Button>
                </DialogActions>
              </form>
            </Dialog>
          );
        }}
      </Mutation>
    </Fragment>
  );
}

const CREATE_TRACK_MUTATION = gql`
  mutation($title: String!, $description: String!, $url: String!) {
    createTrack(title: $title, description: $description, url: $url) {
      track {
        id
        title
        description
        url
      }
    }
  }
`;
