const express = require("express");
const fs = require("node:fs");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const port = 3000;

app.post("/writeDoc", async (req, res) => {
  const content = req.body.content;
  const fileName = req.body.fileName;

  fs.writeFile(`writtenFiles/${fileName}.html`, content, (err) => {
    if (err) console.error(err);
  });
  res.send("wrote file successfully!");
});

app.get("/getDocs", async (req, res) => {
  let filesList = [];
  fs.readdir("writtenFiles/", (err, fileNames) => {
    fileNames.forEach((file) => {
      filesList.push(file.split(".html")[0]);
    });
    console.log(filesList);
    res.send(filesList);
  });
});

app.get("/getDoc:fileName", async (req, res) => {
  fs.readFile(`writtenFiles/${req.params.fileName}.html`, "utf8", (err, data) =>
    res.send(JSON.stringify({ content: data }))
  );
});

app.get("/get-server-status", (req, res) => {
  res.status(200);
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
