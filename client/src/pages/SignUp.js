import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { LockOutlined as LockOutlinedIcon } from "@material-ui/icons";
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  authenticateWithGoogle,
  authenticateWithGitHub,
} from "../helpers/auth";
import PopUpMessage from "../components/common/PopUpMessage";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import CircularProgress from "@material-ui/core/CircularProgress";
import { UserStatusContext } from "../App";
import Copyright from "../components/common/CopyrightMessage";

const useStyles = makeStyles((theme) => ({
  paper: {
    // marginTop: theme.spacing(8),
    // height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  loadingIcon: {
    display: "flex",
    justifyContent: "center",
  },
}));

export default function SignUp() {
  // eslint-disable-next-line
  const [userStatus, setUserStatus] = useContext(UserStatusContext);
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSignUp(event) {
    event.preventDefault();
    if (email && password) {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BASE_API_URL}/user/signup`,
        {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify({ email, password }), // body data type must match "Content-Type" header
        }
      );
      setIsLoading(false);
      if (response.ok) {
        const responseJson = await response.json();
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
        setError(responseText.replace(/"/g, ""));
      }
    } else setError("Please fill in email and password fields.");
  }

  const logInWith3rdParty = async (provider) => {
    setIsLoading(true);
    const response = await fetch(
      `${process.env.REACT_APP_BASE_API_URL}/user/logInWith3rdParty?provider=${provider}`
    );
    setIsLoading(false);
    if (response.ok) {
      const responseJson = await response.json();
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
      setError(responseText.replace(/"/g, ""));
    }
  };

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
              Sign up
            </Typography>
            <form className={classes.form} noValidate onSubmit={onSignUp}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email-input-for-signup"
                    label="Email Address"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  {isLoading ? (
                    <div className={classes.loadingIcon}>
                      <CircularProgress color="secondary" />
                    </div>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      Sign Up
                    </Button>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={() => logInWith3rdParty("google")}
                  >
                    Sign up with Google
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={() => logInWith3rdParty("github")}
                  >
                    Sign up with GitHub
                  </Button>
                </Grid>
              </Grid>
              <Box mt={2}>
                <Grid container justify="flex-end">
                  <Grid item>
                    <Link to="/login" style={{ textDecoration: "none" }}>
                      Already have an account? Login
                    </Link>
                  </Grid>
                </Grid>
              </Box>
              <Box mt={2}>
                <Copyright />
              </Box>
            </form>
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
    </div>
  );
}
