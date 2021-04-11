import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import './Toolbar.css';
import { Block } from 'slate';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({

  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `100%`,
      display: `block`,
      position: `relative`
    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
}));

export default function AppBarCp(props) {

  const classes = useStyles();

  const { title, leftItems, rightItems } = props;
  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          className={classes.menuButton}
        >
        </IconButton>
        <Typography variant="h6" noWrap>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>);
}