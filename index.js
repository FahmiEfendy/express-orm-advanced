const dotenv = require("dotenv");
const express = require("express");

const song = require("./server/api/song");

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.use("/song", song);

app.listen(port, () => {
  console.log(`Successfully connected to port ${port}`);
});
