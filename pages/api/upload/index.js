import nextConnect from "next-connect";
import multer from "multer";
const fs = require("fs");

const upload = multer({
  storage: multer.diskStorage({
    destination: "./",
    filename: (req, file, cb) => cb(null, "video.mp4"),
  }),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.array("file"));

apiRoute.post(async (req, res) => {
  const folderName = `../files/videos/${req.files[0].originalname}`;
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
      fs.copyFile(
        "playlist.m3u8",
        `../files/videos/${req.files[0].originalname}/playlist.m3u8`,
        (err) => {
          if (err) throw err;
          console.log("source.txt was copied to destination.txt");
        }
      );
    } else {
      console.log("error");
    }
  } catch (err) {
    console.log(err);
  }

  const { exec } = require("node:child_process");

  exec(
    `ffmpeg -hide_banner -y -i video.mp4  -vf scale=w=256:h=144:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod  -b:v 250k -maxrate 250k -bufsize 200k -b:a 96k -hls_segment_filename ../files/videos/${req.files[0].originalname}/144p_%03d.ts ../files/videos/${req.files[0].originalname}/144p.m3u8 && ffmpeg -hide_banner -y -i video.mp4  -vf scale=w=426:h=240:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod  -b:v 500k -maxrate 550k -bufsize 600k -b:a 96k -hls_segment_filename ../files/videos/${req.files[0].originalname}/240p_%03d.ts ../files/videos/${req.files[0].originalname}/240p.m3u8 && ffmpeg -hide_banner -y -i video.mp4  -vf scale=w=640:h=360:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod  -b:v 800k -maxrate 856k -bufsize 1200k -b:a 96k -hls_segment_filename ../files/videos/${req.files[0].originalname}/360p_%03d.ts ../files/videos/${req.files[0].originalname}/360p.m3u8 && ffmpeg -hide_banner -y -i video.mp4  -vf scale=w=842:h=480:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod -b:v 1400k -maxrate 1498k -bufsize 2100k -b:a 128k -hls_segment_filename ../files/videos/${req.files[0].originalname}/480p_%03d.ts ../files/videos/${req.files[0].originalname}/480p.m3u8 && ffmpeg -hide_banner -y -i video.mp4  -vf scale=w=1280:h=720:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod -b:v 2800k -maxrate 2996k -bufsize 4200k -b:a 128k -hls_segment_filename ../files/videos/${req.files[0].originalname}/720p_%03d.ts ../files/videos/${req.files[0].originalname}/720p.m3u8 && ffmpeg -hide_banner -y -i video.mp4  -vf scale=w=1920:h=1080:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod -b:v 5000k -maxrate 5350k -bufsize 7500k -b:a 192k -hls_segment_filename ../files/videos/${req.files[0].originalname}/1080p_%03d.ts ../files/videos/${req.files[0].originalname}/1080p.m3u8`,
    (err, output) => {
      // once the command has completed, the callback function is called
      if (err) {
        // log and return if we encounter an error
        console.error("could not execute command: ", err);
        return;
      }
      // log the output received from the command
      res.status(200).json({ data: "success" });
    }
  );
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
