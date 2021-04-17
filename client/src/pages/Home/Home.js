import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/common/Footer";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import styles from "./Home.module.css";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      padding: 5,
    },
  },
}));

export const HomePage = () => {
  const classes = useStyles();
  return (
    <div className="page">
      <Header />
      <section className="midSection">
        <div className={styles.title__mainFlexContainer}>
          <h1 className={styles.title__main}>Welcome to the Chat Room!</h1>
        </div>
        <div className={styles.title__secondaryFlexContainer}>
          <h3>A place to share your thoughts with friends.</h3>
        </div>
        <div className={styles.buttons__flexContainer}>
          <div className={styles.buttons__gridContainer}>
            <Link to="/signup" style={{ textDecoration: "none" }}>
              <Button variant="contained" color="primary" classes={classes}>
                Create New Account
              </Button>
            </Link>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <Button variant="contained" color="secondary" classes={classes}>
                Login to Your Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HomePage;
