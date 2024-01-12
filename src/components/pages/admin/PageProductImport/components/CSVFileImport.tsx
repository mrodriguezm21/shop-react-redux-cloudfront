import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios, { AxiosError } from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

const token =
  window.localStorage.getItem("authorization_token") ??
  import.meta.env.VITE_AUTH_TOKEN;

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    console.log("uploadFile to", url);
    // Basic bXJvZHJpZ3Vlem0yMT1URVNUX1BBU1NXT1JE
    // Get the presigned URL
    try {
      if (file) {
        const response = await axios({
          method: "GET",
          url,
          params: {
            name: encodeURIComponent(file.name),
          },
          headers: {
            Authorization: token,
          },
        });
        console.log("File to upload: ", file.name);
        console.log("Uploading to: ", response.data);
        const result = await fetch(response.data, {
          method: "PUT",
          body: file,
        });
        console.log("Result: ", result);
        setFile(undefined);
        alert("File uploaded!");
      }
    } catch (e) {
      const { response } = e as AxiosError;
      console.log(response);
      if (response?.status === 403) {
        alert("You are not authorized to upload files.");
      } else if (response?.status === 401) {
        alert("You got logged out. Please log in again. ");
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
