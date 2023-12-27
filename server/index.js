//import and setup middleware
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

//define portnumber
const port = 3000;

//define "writeDoc" endpoint
app.post("/writeDoc", async (req, res) => {
  //get content from body
  const content = req.body.content;
  const fileName = req.body.fileName;

  //write file
  fs.writeFile(`writtenFiles/${fileName}.html`, content, (err) => {
    if (err) console.error(err);
  });
  //respond to request
  res.send("wrote file successfully!");
});

//define "getDocs" endpoint
app.get("/getDocs", async (req, res) => {
  let filesList = [];
  fs.readdir("writtenFiles/", (err, fileNames) => {
    fileNames.forEach((file) => {
      filesList.push(file.split(".html")[0]);
    });
    //respond to request
    res.send(filesList);
  });
});

//define "getDoc" endpoint
app.get("/getDoc/:fileName", async (req, res) => {
  fs.readFile(`writtenFiles/${req.params.fileName}.html`, "utf8", (err, data) =>
    //respond to request
    res.send(JSON.stringify({ content: data }))
  );
});

//define "get-server-status" endpoint, it only exists if im ever unsure about if the server is running
app.get("/get-server-status", (req, res) => {
  //respond to request
  res.status(200);
  res.send("server is running");
});

//start the backend
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
