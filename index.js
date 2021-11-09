require("dotenv").config();
const express = require("express");
const { auth } = require("./firebase");
const { createNewRoom, joinRoom } = require("./hms");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://meet-clone-shrihari689.web.app"],
  })
);

app.post("/newMeeting", (req, res) => {
  const token = req.headers["x-api-token"];
  auth
    .verifyIdToken(token)
    .then((user) => {
      createNewRoom(user)
        .then((room) => res.status(201).json(room))
        .catch((err) => res.status(500).json({ error: err.message }));
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.post("/joinMeeting", (req, res) => {
  const token = req.headers["x-api-token"];
  const meetId = req.body.meetId;
  auth
    .verifyIdToken(token)
    .then((user) => {
      joinRoom(user, meetId)
        .then((room) => res.status(200).json(room))
        .catch((err) => res.status(500).json({ error: err.message }));
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.listen(PORT, () => {
  console.log("Listening on " + PORT);
});
