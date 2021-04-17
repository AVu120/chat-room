const express = require("express");
const router = express.Router();
const { db } = require("../services/firebase");

router.get("/", (req, res, next) => {
  try {
    db.ref("messages").once("value", (node) => {
      if (node.val()) res.send(Object.values(node.val()));
      else res.send([]);
    });
  } catch (error) {
    console.error(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    await db.ref("messages").push(req.body, (writeError) => {
      if (writeError) {
        res.status(500).send(writeError);
      } else {
        res.send("Successfully sent message.");
      }
    });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
