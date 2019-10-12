import React, { Fragment } from "react";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import PersonIcon from "@material-ui/icons/Person";
import MenuIcon from "@material-ui/icons/Menu";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Signout from "../Auth/Signout";

const Header = ({ currentUser }) => {
  const useStyles = makeStyles(theme => ({
    icon: {
      marginRight: theme.spacing(2)
    },
    grow: {
      flexGrow: 1,
      display: "flex",
      alignItems: "center",
      textDecoration: "none"
    },
    username: {
      color: "white",
      fontSize: 30
    },
    heroContent: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(8, 0, 6)
    },
    heroButtons: {
      marginTop: theme.spacing(4)
    },
    cardGrid: {
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(8)
    },
    card: {
      height: "100%",
      display: "flex",
      flexDirection: "column"
    },
    cardMedia: {
      paddingTop: "56.25%" // 16:9
    },
    cardContent: {
      flexGrow: 1
    },
    footer: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(6)
    }
  }));
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <SkipNextIcon />
          </IconButton>
          <Link to="/" className={classes.grow}>
            <Typography variant="h6" className={classes.title}>
              PyrexMusic
            </Typography>
          </Link>

          {currentUser && (
            <Link to={`/profile/${currentUser.id}`}>
              <Typography noWrap>{currentUser.username}</Typography>

              <PersonIcon />
            </Link>
          )}
          <Signout />
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
