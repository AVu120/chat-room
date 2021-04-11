const express = require("express");
const router = express.Router();
const { db } = require("../services/firebase");

// Returns DB listener.
router.get("/", function (req, res, next) {
  // Add pub/sub via websocket here.
  const dbRef = db.ref("messages");
  dbRef.once("value", (node) => {
    try {
      // If there are messages, save them into state as an array of objects.
      if (node.val()) res.send(Object.values(node.val()));
      else res.send([]);
    } catch (readError) {
      res.status(500).send(readError);
    }
  });
});

module.exports = router;
