import React, { Fragment } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

import UpdateTrack from "./UpdateTrack";
import DeleteTrack from "./DeleteTrack";
import LikeTrack from "./LikeTrack";
import AudioPlayer from "../Shared/AudioPlayer";
import CreateTrack from "./CreateTrack";

import MoreVertIcon from "@material-ui/icons/MoreVert";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Card from "@material-ui/core/Card";

const useStyles = makeStyles(theme => ({
  card: {
    minWidth: 275,
    display: "flex"
  },
  details: {
    display: "flex",
    flexDirection: "column"
  },
  content: {
    flex: "1 0 auto"
  },
  cover: {
    width: 151
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  playIcon: {
    height: 38,
    width: 38
  }
}));

const TrackList = ({ tracks }) => {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <Fragment>
      <List>
        {tracks.map(track => (
          <ExpansionPanel key={track.id}>
            <ExpansionPanelSummary expandIcon={<MoreVertIcon />}>
              <ListItem>
                <LikeTrack trackId={track.id} likeCount={track.likes.length} />
                <ListItemText
                  primary={track.title}
                  secondary={
                    <Link to={`/profile/${track.author.id}`}>
                      {track.author.username}
                    </Link>
                  }
                />
                <AudioPlayer url={track.url} />
              </ListItem>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <DeleteTrack track={track} />
              <UpdateTrack track={track} />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
      </List>
      <CreateTrack />
    </Fragment>
  );
};

export default TrackList;
