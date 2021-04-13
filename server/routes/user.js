var express = require("express");
var router = express.Router();
const { auth } = require("../services/firebase");

router.post("/signUp", (req, res, next) => {
  const { email, password } = req.body;
  auth()
    .createUserWithEmailAndPassword(email, password)
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
          isAllowedToUseChatroom:
            !isLoggedInWithEmailAndPw ||
            (isLoggedInWithEmailAndPw && isEmailVerified),
        });
      } else throw { message: "No user details found." };
    })
    .catch((error) => {
      res.status(500).send(error.message || error);
    });
});

router.post("/logInWithEmailAndPassword", (req, res, next) => {
  const { email, password } = req.body;
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
          isAllowedToUseChatroom:
            !isLoggedInWithEmailAndPw ||
            (isLoggedInWithEmailAndPw && isEmailVerified),
        });
      } else throw { message: "No user details found." };
    })
    .catch((error) => {
      res.status(500).send(error.message || error);
    });
});

router.get("/logInWith3rdParty", (req, res, next) => {
  try {
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
            isAllowedToUseChatroom:
              !isLoggedInWithEmailAndPw ||
              (isLoggedInWithEmailAndPw && isEmailVerified),
          });
        } else throw { message: "No user details found." };
      })
      .catch((error) => {
        res.status(500).send(error.message || error);
      });
  } catch (error) {
    console.error(error);
  }
});

router.get("/logout", async (req, res, next) => {
  try {
    await auth().signOut();
    res.send("User has successfully logged out.");
  } catch (error) {
    res.status(500).send(error.message || error);
  }
});

router.get("/status", async (req, res, next) => {
  try {
    const user = auth().currentUser;

    if (user) {
      await user.reload();
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
          isAllowedToUseChatroom:
            !isLoggedInWithEmailAndPw ||
            (isLoggedInWithEmailAndPw && isEmailVerified),
        });
      }
    } else {
      res.status(404).send("No user is logged in.");
    }
  } catch (error) {
    res.status(500).send(error.message || error);
  }
});

router.get("/changeLogInEmail", async (req, res, next) => {
  const { newEmail } = req.query;
  try {
    await auth().currentUser.updateEmail(newEmail);
    res.status(200).send("Successfully changed login email.");
  } catch (error) {
    res.status(500).send(error.message || error);
  }
});

router.get("/resetPassword", async (req, res, next) => {
  const { email } = req.query;
  try {
    await auth().sendPasswordResetEmail(email);
    res.status(200).send("Successfully send reset password email.");
  } catch (error) {
    res.status(500).send(error.message || error);
  }
});

router.delete("/account", async (req, res, next) => {
  try {
    const user = auth().currentUser;

    if (user)
      auth()
        .currentUser.delete()
        .then(() => {
          res.send("Successfully deleted account.");
        })
        .catch((error) => {
          res.status(500).send(error.message);
        });
    else res.status(404).send("Account not found.");
  } catch (error) {
    console.error(error.message || error);
  }
});
module.exports = router;
