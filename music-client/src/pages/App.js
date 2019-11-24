import React, { Fragment, useState } from "react";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";

import TrackList from "../components/Track/TrackList";
import Error from "../components/Shared/Error";
import Loading from "../components/Shared/Loading";
import SearchTracks from "../components/Track/SearchTracks";

const App = () => {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <Fragment>
      <SearchTracks setSearchResults={setSearchResults} />
      <Query query={GET_TRACKS_QUERY}>
        {({ data, loading, error }) => {
          if (loading) return <Loading />;
          if (error) return <Error />;
          const tracks = searchResults.length > 0 ? searchResults : data.tracks;
          return <TrackList tracks={tracks} />;
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
