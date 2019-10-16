import React, { useState, useRef } from "react";
import { ApolloConsumer } from "react-apollo";
import { gql } from "apollo-boost";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import SearchIcon from "@material-ui/icons/Search";
import { FormControl, TextField } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center"
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  divider: {
    height: 28,
    margin: 4
  }
}));

const SearchTracks = ({ setSearchResults }) => {
  const classes = useStyles();

  const [search, setSearch] = useState("");
  const inputEl = useRef();

  const clearSearchInput = () => {
    setSearchResults([]);
    setSearch("");
    inputEl.current.focus();
  };

  const handleSubmit = async (event, client) => {
    event.preventDefault();
    const res = await client.query({
      query: SEARCH_TRACKS_QUERY,
      variables: { search }
    });
    setSearchResults(res.data.tracks);
    console.log(res.data.tracks);
  };

  return (
    <ApolloConsumer>
      {client => (
        <form onSubmit={event => handleSubmit(event, client)}>
          <Paper className={classes.root}>
            <IconButton
              onClick={clearSearchInput}
              className={classes.iconButton}
              aria-label="menu"
            >
              <ClearAllIcon />
            </IconButton>
            <TextField
              fullWidth
              className={classes.input}
              placeholder="Search Tracks"
              inputProps={{
                "aria-label": "search tracks"
              }}
              onChange={event => setSearch(event.target.value)}
              value={search}
              inputRef={inputEl}
            />

            <IconButton className={classes.iconButton} aria-label="search">
              <SearchIcon type="submit" />
            </IconButton>

            <IconButton
              color="primary"
              className={classes.iconButton}
              aria-label="directions"
            ></IconButton>
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
