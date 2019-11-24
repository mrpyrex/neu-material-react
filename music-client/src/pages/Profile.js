import React from "react";
import { Mutation, Query } from "react-apollo";
import { gql } from "apollo-boost";
import Container from "@material-ui/core/Container";

import Card from "@material-ui/core/Card";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

import Error from "../components/Shared/Error";
import AudioPlayer from "../components/Shared/AudioPlayer";
import Loading from "../components/Shared/Loading";
import AudiotrackIcon from "@material-ui/icons/Audiotrack";
import { CardHeader, Avatar, Paper, Typography } from "@material-ui/core";

const Profile = ({ match }) => {
  const id = match.params.id;
  return (
    <Query query={PROFILE_QUERY} variables={{ id }}>
      {({ data, loading, error }) => {
        if (loading) return <Loading />;
        if (error) return <Error error={error} />;

        return (
          <Container>
            <Card>
              <CardHeader
                avatar={<Avatar>{data.user.username[0]}</Avatar>}
                title={data.user.username}
                // subheader={format(data.user.dateJoined, "MMM Do, YYYY")}
                subheader={`Joined since ${data.user.dateJoined}`}
              />
            </Card>
            <Paper elevation={3} square={true}>
              <Typography>
                <AudiotrackIcon />
                Created Tracks
              </Typography>
              {data.user.trackSet.map(track => (
                <div key={track.id}>
                  <Typography>
                    {track.title} {track.likes.length}
                  </Typography>
                  <AudioPlayer url={track.url} />
                </div>
              ))}
            </Paper>
            <Paper>
              <Typography>
                <FavoriteBorderIcon />
                Liked Tracks
              </Typography>
              {data.user.likeSet.map(({ track }) => (
                <div key={track.id}>
                  <Typography>
                    {track.title} {track.likes.length} {track.author.username}
                  </Typography>
                  <AudioPlayer url={track.url} />
                </div>
              ))}
            </Paper>
          </Container>
        );
      }}
    </Query>
  );
};

export default Profile;

const PROFILE_QUERY = gql`
  query($id: Int!) {
    user(id: $id) {
      id
      username
      dateJoined
      likeSet {
        id
        track {
          id
          title
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
      trackSet {
        id
        url
        title
        description
        likes {
          id
        }
      }
    }
  }
`;
