import React from "react";
import { makeStyles, Link as ExternalLink } from "@material-ui/core";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: 0,
  },
  title: {},
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title}>
            &copy;{" "}
            <ExternalLink
              color="inherit"
              href="https://www.linkedin.com/in/anthony-hien-vu"
              target="_blank"
              // style={{  }}
            >
              Anthony Hien Vu
            </ExternalLink>
            's Chat Room 2020.
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
