import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserStatusContext } from "../../App";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";
import PopUpMessage from "../../components/common/PopUpMessage";
import ResetPassword from "../../components/common/ResetPassword";
import {
  logInWith3rdParty,
  logInWithEmailAndPassword,
} from "../../helpers/auth";
import { Copyright, useStyles } from "./LogIn.style";

export default function LogIn() {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResetPasswordWindow, setShowResetPasswordWindow] = useState(false);
  const { setUserStatus } = useContext(UserStatusContext);

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
            <form
              className={classes.form}
              noValidate
              onSubmit={(event) =>
                logInWithEmailAndPassword({
                  event,
                  email,
                  password,
                  setIsLoading,
                  setUserStatus,
                  setError,
                })
              }
            >
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email-input-for-login"
                label="Email Address"
                type="email"
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
                    onClick={() =>
                      logInWith3rdParty({
                        provider: "google",
                        setIsLoading,
                        setUserStatus,
                        setError,
                      })
                    }
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
                    onClick={() =>
                      logInWith3rdParty({
                        provider: "github",
                        setIsLoading,
                        setUserStatus,
                        setError,
                      })
                    }
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
          forgot
        />
      )}
    </div>
  );
}
