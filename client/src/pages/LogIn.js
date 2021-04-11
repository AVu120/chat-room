import React, { useState, useContext } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link } from "react-router-dom";
import ExternalLink from "@material-ui/core/Link";
import {
  authenticateWithGoogle,
  authenticateWithGitHub,
} from "../helpers/auth";
import { createErrorMessage } from "../helpers/error-handlers";
import PopUpMessage from "../components/common/PopUpMessage";
import ResetPassword from "../components/common/ResetPassword";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import CircularProgress from "@material-ui/core/CircularProgress";
import { UserStatusContext } from "../App";

const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <ExternalLink
        color="inherit"
        href="https://www.linkedin.com/in/anthony-hien-vu"
      >
        Anthony Hien Vu
      </ExternalLink>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  primarySubmit: {
    margin: theme.spacing(1, 0, 1),
  },
  secondarySubmit: {
    margin: theme.spacing(1, 0, 1),
  },
  loadingIcon: {
    display: "flex",
    justifyContent: "center",
    margin: "10px 0",
  },
}));

export default function LogIn() {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResetPasswordWindow, setShowResetPasswordWindow] = useState(false);
  // eslint-disable-next-line
  const [userStatus, setUserStatus] = useContext(UserStatusContext);

  async function emailLogIn(event) {
    event.preventDefault();
    if (email && password) {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BASE_API_URL}/user/login`,
        {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          // mode: "cors", // no-cors, *cors, same-origin
          // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          // credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
          },
          // redirect: "follow", // manual, *follow, error
          // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify({ email, password }), // body data type must match "Content-Type" header
        }
      );
      setIsLoading(false);
      console.log({ response });
      if (response.ok) {
        const responseJson = await response.json();
        console.log(responseJson);
        setUserStatus((state) => ({
          ...state,
          isAuthenticated: true,
          userId: responseJson.userId,
          email: responseJson.email,
          isLoggedInWithEmailAndPw: responseJson.isLoggedInWithEmailAndPw,
          isVerifiedToUseChatroom: responseJson.isVerifiedToUseChatroom,
          displayName: responseJson.displayName,
        }));
      } else {
        const responseText = await response.text();
        console.log(responseText);
        setError(responseText.replace(/"/g, ""));
      }
    } else {
      setError("Please fill in email and password fields.");
    }
  }

  async function googleLogIn() {
    try {
      await authenticateWithGoogle();
    } catch (error) {
      setError(createErrorMessage({ authService: "Google", error }));
    }
  }

  async function gitHubLogIn() {
    try {
      await authenticateWithGitHub();
    } catch (error) {
      setError(createErrorMessage({ authService: "GitHub", error }));
    }
  }

  return (
    <div className="page">
      <Header />
      <section className="midSection">
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <form className={classes.form} noValidate onSubmit={emailLogIn}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email-input-for-login"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />

              {isLoading ? (
                <div className={classes.loadingIcon}>
                  <CircularProgress color="secondary" />
                </div>
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.primarySubmit}
                  type="submit"
                >
                  Login
                </Button>
              )}
              <Grid container>
                <Grid item xs>
                  <div
                    style={{
                      textDecoration: "none",
                      cursor: "pointer",
                      color: "purple",
                    }}
                    onClick={() => setShowResetPasswordWindow(true)}
                  >
                    Forgot password?
                  </div>
                </Grid>
                <Grid item>
                  <Link
                    to="/signup"
                    style={{ textDecoration: "none", color: "purple" }}
                  >
                    Don't have an account? Sign Up
                  </Link>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    className={classes.secondarySubmit}
                    onClick={() => googleLogIn()}
                  >
                    Login with Google
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    className={classes.secondarySubmit}
                    onClick={() => gitHubLogIn()}
                  >
                    Login with GitHub
                  </Button>
                </Grid>
              </Grid>
            </form>
            <Box mt={2}>
              <Copyright />
            </Box>
          </div>
          {error && (
            <PopUpMessage
              title="Error"
              message={error}
              open={Boolean(error)}
              handleClose={() => setError(null)}
            />
          )}
        </Container>
      </section>
      <Footer />
      {showResetPasswordWindow && (
        <ResetPassword
          open={showResetPasswordWindow}
          onClose={setShowResetPasswordWindow}
          setError={setError}
        />
      )}
    </div>
  );
}
