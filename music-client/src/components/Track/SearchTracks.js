import React, { useState } from "react";
import { ApolloConsumer } from "react-apollo";
import { gql } from "apollo-boost";
import { Paper, IconButton, TextField } from "@material-ui/core";
import ClearAllTwoToneIcon from "@material-ui/icons/ClearAllTwoTone";
import SearchIcon from "@material-ui/icons/Search";

const SearchTracks = ({ setSearchResults }) => {
  const [search, setSearch] = useState("");

  const clearSearchInput = () => {
    setSearchResults([]);
    setSearch("");
  };

  const handleSubmit = async (event, client) => {
    event.preventDefault();
    const res = await client.query({
      query: SEARCH_TRACKS_QUERY,
      variables: { search }
    });

    setSearchResults(res.data.tracks);
  };

  return (
    <ApolloConsumer>
      {client => (
        <form onSubmit={event => handleSubmit(event, client)}>
          <Paper>
            <IconButton onClick={clearSearchInput}>
              <ClearAllTwoToneIcon />
            </IconButton>
            <TextField
              fullWidth
              placeholder="seacrh tracks"
              InputProps={{ disableUnderline: true }}
              onClick={event => setSearch(event.target.value)}
              value={search}
            />
            <IconButton type="submit">
              <SearchIcon />
            </IconButton>
          </Paper>
        </form>
      )}
    </ApolloConsumer>
  );
};

export default SearchTracks;

const SEARCH_TRACKS_QUERY = gql`
  query($search: String) {
    tracks(search: $search) {
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
