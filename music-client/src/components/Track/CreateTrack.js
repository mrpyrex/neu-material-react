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
import {
  FormControl,
  Button,
  TextField,
  FormHelperText
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

import Error from "../Shared/Error";
import { GET_TRACKS_QUERY } from "../../pages/App";

const useStyles = makeStyles(theme => ({
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  progress: {
    margin: theme.spacing(2)
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
  const [fileError, setFileError] = useState("");

  const handleAudio = event => {
    const selectedFile = event.target.files[0];
    const fileSizeLimit = 10000000; // 4mb
    if (selectedFile && selectedFile.size > fileSizeLimit) {
      setFileError(`${selectedFile.name}: is larger than 4mb`);
    } else {
      setFile(selectedFile);
      setFileError("");
    }
  };

  const handleAudioUpload = async () => {
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("resource_type", "raw");
      data.append("upload_preset", "pyrexmusic");
      data.append("cloud_name", "neupytech");

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/neupytech/raw/upload/",
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
    createTrack({ variables: { title, description, url: uploadUrl } });
  };

  const handleUpdateCache = (cache, { data: { createTrack } }) => {
    const data = cache.readQuery({ query: GET_TRACKS_QUERY });
    const tracks = data.tracks.concat(createTrack.track);
    cache.writeQuery({ query: GET_TRACKS_QUERY, data: { tracks } });
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
          setTitle("");
          setDescription("");
          setFile("");
        }}
        update={handleUpdateCache}
        // refetchQueries={() => [{ query: GET_TRACKS_QUERY }]}
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
                        value={title}
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
                        value={description}
                      />
                    </FormControl>
                  </div>
                  <div>
                    <FormControl error={Boolean(fileError)}>
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
                        <FormHelperText>{fileError}</FormHelperText>
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
                    {submitting ? (
                      <CircularProgress
                        className={classes.progress}
                        size={20}
                      />
                    ) : (
                      "Add Track"
                    )}
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
        likes {
          id
        }
        author {
          id
          username
        }
      }
    }
  }
`;
