const express = require("express");
const fs = require("node:fs");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3000;

app.post("/write", async (req, res) => {
  const content = req.body.content;
  const fileName = req.body.fileName;

  fs.writeFile(`writtenFiles/${fileName}`, content, (err) => {
    if (err) console.error(err);
  });
  res.send("wrote file successfully!");
});

app.get("/get-server-status", (req, res) => {
  res.status(200);
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
