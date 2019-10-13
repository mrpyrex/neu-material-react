import React, { Fragment } from "react";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";
import SearchTracks from "../components/Track/SearchTracks";
import TrackList from "../components/Track/TrackList";
import CreateTrack from "../components/Track/CreateTrack";
import Error from "../components/Shared/Error";
import Loading from "../components/Shared/Loading";

const App = () => {
  return (
    <Fragment>
      <SearchTracks />
      <Query query={GET_TRACKS_QUERY}>
        {({ data, loading, error }) => {
          if (loading) return <Loading />;
          if (error) return <Error />;
          return <TrackList tracks={data.tracks} />;
        }}
      </Query>
    </Fragment>
  );
};

export const GET_TRACKS_QUERY = gql`
  query getTracksQuery {
    tracks {
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
`;

export default App;
