import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function App() {
  const [content, setContent] = useState("");
  const [fileName, setfileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [savedSuccessfully, setSavedSuccessfully] = useState<boolean>();

  const handleWrite = async () => {
    setIsLoading(true);
    const response = await fetch("http://localhost:3000/writeDoc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileName: fileName, content: content }),
    });
    if (response.ok) {
      setSavedSuccessfully(true);
      setInterval(() => {
        setSavedSuccessfully(false);
      }, 2000);
      setIsLoading(false);
    }
  };
  console.log(content);
  return (
    <>
      <ReactQuill theme="snow" value={content} onChange={setContent} />
      <input
        value={fileName}
        onInput={(e) => setfileName(e.target.value)}
        type="text"
        placeholder="Filename (exclude file extension)"
      />
      <button onClick={handleWrite}>Save file to server</button>
      {isLoading && "waiting for the server to respond..."}
      {savedSuccessfully && "saved successfully!"}
    </>
  );
}

export default App;
