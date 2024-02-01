const dotenv = require("dotenv");
const express = require("express");

const song = require("./server/api/song");
const playlist = require("./server/api/playlist");

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.use("/song", song);
app.use("/playlist", playlist);

app.listen(port, () => {
  console.log(`Successfully connected to port ${port}`);
});
