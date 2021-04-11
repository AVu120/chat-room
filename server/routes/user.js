var express = require("express");
var router = express.Router();
const { auth } = require("../services/firebase");

router.post("/signup", (req, res, next) => {
  const { email, password } = req.body;
  auth()
    .createUserWithEmailAndPassword(email, password)
    .then((user) => {
      if (user) {
        const isLoggedInWithEmailAndPw =
          user.providerData[0]?.providerId === "password";
        const isEmailVerified = user.emailVerified;

        !isEmailVerified && auth().currentUser.sendEmailVerification();

        res.send({
          userId: user.uid,
          displayName: user.displayName,
          email: user.email,
          isLoggedInWithEmailAndPw,
          isVerifiedToUseChatroom:
            !isLoggedInWithEmailAndPw ||
            (isLoggedInWithEmailAndPw && isEmailVerified),
        });
      } else throw { message: "No user details found." };
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});

router.post("/loginWithEmailAndPassword", (req, res, next) => {
  const { email, password } = req.body;
  console.log("LOG IN ATTEMPTED");
  auth()
    .signInWithEmailAndPassword(email, password)
    .then((user) => {
      if (user) {
        const isLoggedInWithEmailAndPw =
          user.additionalUserInfo.providerId === "password";
        const isEmailVerified = user.user.emailVerified;

        !isEmailVerified && auth().currentUser.sendEmailVerification();

        res.send({
          userId: user.user.uid,
          displayName: user.user.displayName,
          email: user.user.email,
          isLoggedInWithEmailAndPw,
          isVerifiedToUseChatroom:
            !isLoggedInWithEmailAndPw ||
            (isLoggedInWithEmailAndPw && isEmailVerified),
        });
      } else throw { message: "No user details found." };
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});

router.get("/logInWith3rdParty", (req, res, next) => {
  const provider =
    req.query.provider === "github"
      ? new auth.GithubAuthProvider()
      : new auth.GoogleAuthProvider();
  auth()
    .signInWithPopup(provider)
    .then((user) => {
      if (user) {
        const isLoggedInWithEmailAndPw =
          user.additionalUserInfo.providerId === "password";
        const isEmailVerified = user.user.emailVerified;

        !isEmailVerified && auth().currentUser.sendEmailVerification();

        res.send({
          userId: user.user.uid,
          displayName: user.user.displayName,
          email: user.user.email,
          isLoggedInWithEmailAndPw,
          isVerifiedToUseChatroom:
            !isLoggedInWithEmailAndPw ||
            (isLoggedInWithEmailAndPw && isEmailVerified),
        });
      } else throw { message: "No user details found." };
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});

router.get("/logout", async (req, res, next) => {
  try {
    await auth().signOut();
    res.send("User has successfully logged out.");
  } catch (error) {
    res.status(500).send("User logout failed.");
  }
});

router.get("/status", (req, res, next) => {
  const user = auth().currentUser;

  if (user) {
    const isLoggedInWithEmailAndPw =
      user.providerData[0].providerId === "password";
    const isEmailVerified = user.emailVerified;

    !isEmailVerified && auth().currentUser.sendEmailVerification();

    res.send({
      userId: user.uid,
      displayName: user.displayName,
      email: user.email,
      isLoggedInWithEmailAndPw,
      isVerifiedToUseChatroom:
        !isLoggedInWithEmailAndPw ||
        (isLoggedInWithEmailAndPw && isEmailVerified),
    });
  } else {
    res.status(404).send("No user is logged in.");
  }
});

module.exports = router;
