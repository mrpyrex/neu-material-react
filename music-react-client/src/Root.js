import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import withRoot from "./withRoot";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import Profile from "./pages/Profile";
import App from "./pages/App";
import Header from "./components/Shared/Header";

const Root = () => (
  <Query query={ME_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <div>Loading</div>;
      if (error) return <div>Error</div>;

      const currentUser = data.me;
      return (
        <Router>
          <Fragment>
            <Header currentUser={currentUser} />
            <Switch>
              <Route exact path="/" component={App} />
              <Route path="/profile/:id" component={Profile} />
            </Switch>
          </Fragment>
        </Router>
      );
    }}
  </Query>
);

// const GET_TRACKS_QUERY = gql`
//   {
//     tracks {
//       id
//       description
//       title
//       url
//     }
//   }
// `;

const ME_QUERY = gql`
  {
    me {
      id
      username
    }
  }
`;

export default withRoot(Root);
