import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import { LockOutlined as LockOutlinedIcon } from "@material-ui/icons";
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import PopUpMessage from "../../components/common/PopUpMessage";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import CircularProgress from "@material-ui/core/CircularProgress";
import { UserStatusContext } from "../../App";
import Copyright from "../../components/common/CopyrightMessage";
import { useStyles } from "./SignUp.style";
import {
  SignUpWithEmailAndPassword,
  // logInWith3rdParty,
} from "../../helpers/auth";

export default function SignUp() {
  const { setUserStatus } = useContext(UserStatusContext);
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
            <form
              className={classes.form}
              noValidate
              onSubmit={(event) =>
                SignUpWithEmailAndPassword({
                  event,
                  email,
                  password,
                  setIsLoading,
                  setUserStatus,
                  setError,
                })
              }
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    type="email"
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
                {/* <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={() =>
                      logInWith3rdParty({
                        provider: "google",
                        setIsLoading,
                        setUserStatus,
                        setError,
                      })
                    }
                  >
                    Sign up with Google
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={() =>
                      logInWith3rdParty({
                        provider: "github",
                        setIsLoading,
                        setUserStatus,
                        setError,
                      })
                    }
                  >
                    Sign up with GitHub
                  </Button>
                </Grid> */}
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
