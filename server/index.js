const express = require("express");
const fs = require("node:fs");
const multer = require("multer");
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

// Set up Multer (adjust the storage options as needed)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in 'uploads' directory. Make sure it exists.
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + ".jpg");
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("attatchment"), (req, res) => {
  // You can access the file using req.file
  console.log(req.file);
  res.json({ message: "File uploaded successfully" });
});

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
    res.send(filesList);
  });
});

app.get("/getDoc/:fileName", async (req, res) => {
  fs.readFile(`writtenFiles/${req.params.fileName}.html`, "utf8", (err, data) =>
    res.send(JSON.stringify({ content: data }))
  );
});

app.post("/setAttachment/:fileName", async (req, res) => {
  console.log("reqwerwerwer", req);
  res.send("request recived");
});

app.get("/get-server-status", (req, res) => {
  res.status(200);
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
