import React from "react";
import { ApolloConsumer } from "react-apollo";
import IconButton from "@material-ui/core/IconButton";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const Signout = () => {
  const handleSignout = client => {
    localStorage.removeItem("authToken");
    client.writeData({ data: { isLoggedIn: false } });
    console.log("User signed out", client);
  };
  return (
    <ApolloConsumer>
      {client => (
        <IconButton
          onClick={() => handleSignout(client)}
          className="waves-effect waves-light btn "
        >
          <ExitToAppIcon />
        </IconButton>
      )}
    </ApolloConsumer>
  );
};

export default Signout;
