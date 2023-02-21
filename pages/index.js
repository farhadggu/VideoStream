import styles from "../styles/Home.module.css";
import axios from "axios";
import { useEffect, useReducer, useRef, useState } from "react";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";

export default function Home() {
  const [video, setVideo] = useState();
  const [loading, setLoading] = useState(false);
  const [showVideo, setShowVideo] = useState();
  const [folder, setFolder] = useState("");
  const [folderName, setFolderName] = useState("");
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);

  const handleVideos = async (e) => {
    const file = await e.target.files[0];
    setVideo(file);
    setShowVideo(URL.createObjectURL(file));
  };

  const onClickVideo = async () => {
    setLoading(true);
    const formData = new FormData();

    await axios
      .post("/api/folder", { folder })
      .then((resp) => setFolderName(resp.data.folderName))
      .catch((err) => console.log(err));
    formData.append("file", video, `${folder}`);
    await axios
      .post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/formdata",
        },
        onUploadProgress: (event) => {
          console.log(
            `Current progress:`,
            Math.round((event.loaded * 100) / event.total)
          );
        },
      })
      .then((resp) => {
        setLoading(false);
        setMessage("Video Has Been Uploaded Sucessfully");
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <Box>
      <Box className={styles.main}>
        <Typography className={styles.mainTitle}>
          NahalGasht Video Stream Uploader
        </Typography>
        <Grid container columnGap={2} alignItems="center">
          <Grid
            item
            md={5.8}
            display="flex"
            flexDirection="column"
            gap="20px"
            alignItems="flex-start"
          >
            <Typography
              style={{ color: "#fff", fontSize: "20px", marginBottom: "20px" }}
            >
              Please Select Video To Start Uploading
            </Typography>
            <Box display="flex" alignItems="center" gap="30px" width="100%">
              <Box display="flex" flexDirection="column">
                <input
                  className={styles.mainInput}
                  type="text"
                  name="folder"
                  value={folder}
                  onChange={(e) => setFolder(e.target.value)}
                  placeholder="Upload Directory Name"
                />
              </Box>
              <Button
                className={styles.videoBtn}
                onClick={() => inputRef.current.click()}
                disabled={!folder}
              >
                Select Video
              </Button>
            </Box>
          </Grid>
          <Grid item md={5.8}>
            {showVideo ? (
              <video className={styles.mainVideo} controls>
                <source src={showVideo}></source>
              </video>
            ) : (
              <Typography sx={{ color: "#fff", textAlign: "center" }}>
                Please Select a Video to Preview...
              </Typography>
            )}
          </Grid>
        </Grid>
        <input
          name="file"
          type="file"
          onChange={handleVideos}
          ref={inputRef}
          style={{ display: "none" }}
        />

        {loading ? (
          <CircularProgress color="success" />
        ) : (
          <Button
            disabled={!folder || !video}
            className={styles.successBtn}
            onClick={() => onClickVideo()}
          >
            Upload Video
          </Button>
        )}
        {message && (
          <Typography sx={{ fontSize: "18px", color: "green" }}>
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
