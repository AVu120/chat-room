const express = require("express");
const router = express.Router();
const { db } = require("../services/firebase");

router.get("/", (req, res, next) => {
  db.ref("messages").once("value", (node) => {
    try {
      if (node.val()) res.send(Object.values(node.val()));
      else res.send([]);
    } catch (readError) {
      res.status(500).send(readError);
    }
  });
});

router.post("/", async (req, res, next) => {
  console.log("RUNS");
  await db.ref("messages").push(req.body, (writeError) => {
    if (writeError) {
      console.error({ writeError });
      res.status(500).send(writeError);
    } else {
      res.send("Successfully sent message.");
      console.log("SUCCESS");
    }
  });
});

module.exports = router;
