import React from "react";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";

import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import { Container } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

import UpdateTrack from "./UpdateTrack";
import DeleteTrack from "./DeleteTrack";
import LikeTrack from "./LikeTrack";
import CreateTrack from "./CreateTrack";
import AudioPlayer from "../Shared/AudioPlayer";

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 345
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[300]
  }
}));

const TrackList = ({ tracks }) => {
  const classes = useStyles();

  return (
    <Container className={classes.cardGrid} maxWidth="md">
      <Grid container spacing={3}>
        {tracks.map(track => (
          <Grid item key={track.id} xs={12} sm={6} md={4}>
            <Card>
              <CardHeader
                avatar={
                  <Avatar aria-label="recipe" className={classes.avatar}>
                    R
                  </Avatar>
                }
                title={
                  <Link to={`/profile/${track.author.id}`}>
                    {track.author.username}
                  </Link>
                }
                subheader="September 14, 2016"
              />
              <CardMedia
                className={classes.media}
                image="/static/images/cards/paella.jpg"
                title="Paella dish"
              />
              <CardContent>
                <AudioPlayer url={track.url} />
              </CardContent>
              <CardActions>
                <IconButton aria-label="add to favorites">
                  <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                  <ShareIcon />
                </IconButton>
                <DeleteTrack track={track} />
                <UpdateTrack track={track} />
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <CreateTrack />
    </Container>
  );
};
export default TrackList;
