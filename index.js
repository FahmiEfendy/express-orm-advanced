const dotenv = require("dotenv");
const express = require("express");

const song = require("./server/api/song");
const playlist = require("./server/api/playlist");
const user = require("./server/api/user");

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.use("/api/song", song);
app.use("/api/playlist", playlist);
app.use("/api/user", user);

app.use((req, res) => {
  res.status(404).send("Routes Not Found!!!");
});

app.use((req, res) => {
  res.status(500).send("Internal Server Error!!!");
});

app.listen(port, () => {
  console.log(`Successfully connected to port ${port}`);
});
