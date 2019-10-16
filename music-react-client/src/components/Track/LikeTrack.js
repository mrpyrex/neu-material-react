import React, { useContext } from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import { IconButton } from "@material-ui/core";

import { UserContext, ME_QUERY } from "../../Root";

const LikeTrack = ({ trackId, likeCount }) => {
  const currentUser = useContext(UserContext);
  const handleDisabledLikeTrack = () => {
    const userLikes = currentUser.likeSet;
    const isTrackLiked =
      userLikes.findIndex(({ track }) => track.id === trackId) > -1;
    return isTrackLiked;
  };
  return (
    <Mutation
      mutation={CREATE_LIKE_MUTATION}
      variables={{ trackId }}
      refetchQueries={() => [{ query: ME_QUERY }]}
    >
      {createLike => (
        <IconButton
          onClick={event => {
            event.stopPropagation();
            createLike();
          }}
          disabled={handleDisabledLikeTrack()}
        >
          {likeCount}
          <FavoriteBorderIcon />
        </IconButton>
      )}
    </Mutation>
  );
};

export default LikeTrack;

const CREATE_LIKE_MUTATION = gql`
  mutation($trackId: Int!) {
    createLike(trackId: $trackId) {
      track {
        id
        likes {
          id
        }
      }
    }
  }
`;
