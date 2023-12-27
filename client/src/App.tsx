import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function App() {
  //define all states
  const [content, setContent] = useState("");
  const [fileName, setfileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [savedSuccessfully, setSavedSuccessfully] = useState<boolean>();

  const [filesList, setFilesList] = useState(null);

  //handler for writing files
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
    fetchFiles();
  };

  //funciton for fetching the list of files
  const fetchFiles = async () => {
    const response = await fetch("http://localhost:3000/getDocs", {
      method: "get",
    });
    //parse the json
    const data = await response.json();
    setFilesList(data);
  };
  useEffect(() => {
    fetchFiles();
  }, []);

  //funciton for fetching a specific file
  const fetchFile = async (fileName: string) => {
    const response = await fetch(`http://localhost:3000/getDoc/${fileName}`, {
      method: "get",
    });
    //parse the json
    const data = await response.json();
    setContent(data.content);
  };

  return (
    <>
      <select
        onInput={(e) => {
          const fileName = e.target.value;
          fetchFile(fileName);
          setfileName(fileName);
        }}
      >
        <option value="">please choose a file</option>
        {filesList &&
          filesList.map((item) => {
            return (
              <option key={item} value={item}>
                {item}
              </option>
            );
          })}
      </select>
      <input
        value={fileName}
        onInput={(e) => setfileName(e.target.value)}
        type="text"
        placeholder="Filename (exclude file extension)"
      />
      <button onClick={handleWrite}>Save file to server</button>
      {isLoading && "waiting for the server to respond..."}
      {savedSuccessfully && "saved successfully!"}
      <ReactQuill theme="snow" value={content} onChange={setContent} />
    </>
  );
}

export default App;
