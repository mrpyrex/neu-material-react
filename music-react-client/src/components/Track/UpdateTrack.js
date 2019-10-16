import React, { Fragment, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import axios from "axios";

import { UserContext } from "../../Root";

import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
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

const useStyles = makeStyles(theme => ({
  fab: {
    margin: theme.spacing(1)
  },
  progress: {
    margin: theme.spacing(2)
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  }
}));

const UpdateTrack = ({ track }) => {
  const currentUser = useContext(UserContext);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(track.title);
  const [description, setDescription] = useState(track.description);
  const [file, setFile] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fileError, setFileError] = useState("");

  const isCurrentuser = currentUser.id === track.author.id;

  const handleAudio = event => {
    const selectedFile = event.target.files[0];
    const fileSizeLimit = 4000000; // 4mb
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

  const handleSubmit = async (event, updateTrack) => {
    event.preventDefault();
    setSubmitting(true);
    const uploadUrl = await handleAudioUpload();
    updateTrack({
      variables: { trackId: track.id, title, description, url: uploadUrl }
    });
  };

  const classes = useStyles();
  return (
    isCurrentuser && (
      <Fragment>
        <IconButton onClick={() => setOpen(true)}>
          <EditIcon />
        </IconButton>

        <Mutation
          mutation={UPDATE_TRACK_MUTATION}
          onCompleted={data => {
            setSubmitting(false);
            setOpen(false);
            setTitle("");
            setDescription("");
            setFile("");
          }}
        >
          {(updateTrack, { loading, error }) => {
            if (error) return <Error error={error} />;
            return (
              <Dialog open={open}>
                <form onSubmit={event => handleSubmit(event, updateTrack)}>
                  <DialogTitle>Update Track</DialogTitle>
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
                        "Update Track"
                      )}
                    </Button>
                  </DialogActions>
                </form>
              </Dialog>
            );
          }}
        </Mutation>
      </Fragment>
    )
  );
};
export default UpdateTrack;

const UPDATE_TRACK_MUTATION = gql`
  mutation($trackId: Int!, $title: String, $description: String, $url: String) {
    updateTrack(
      trackId: $trackId
      title: $title
      description: $description
      url: $url
    ) {
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
