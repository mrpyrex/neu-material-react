import React from "react";
import { ApolloConsumer } from "react-apollo";

const Signout = () => {
  const handleSignout = client => {
    localStorage.removeItem("authToken");
    client.writeData({ data: { isLoggedIn: false } });
    console.log("User signed out", client);
  };
  return (
    <ApolloConsumer>
      {client => (
        <button
          onClick={() => handleSignout(client)}
          className="waves-effect waves-light btn "
        >
          Signout
        </button>
      )}
    </ApolloConsumer>
  );
};

export default Signout;
