import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
dotenv.config();

const VIMEO_TOKEN = process.env.VIMEO_ACCESS_TOKEN;

// Upload to Vimeo
export const uploadToVimeo = async (filePath, title, description) => {
  const fileSize = fs.statSync(filePath).size;
  const fileStream = fs.createReadStream(filePath);

  const form = new FormData();
  form.append("upload", JSON.stringify({ approach: "tus", size: fileSize }));
  form.append("name", title);
  form.append("description", description);

  const headers = {
    ...form.getHeaders(),
    Authorization: `Bearer ${VIMEO_TOKEN}`,
  };

  const createRes = await axios.post("https://api.vimeo.com/me/videos", form, { headers });
  const uploadLink = createRes.data.upload.upload_link;

  await axios.patch(uploadLink, fileStream, {
    headers: {
      "Tus-Resumable": "1.0.0",
      "Upload-Offset": 0,
      "Content-Type": "application/offset+octet-stream",
      "Content-Length": fileSize,
      Authorization: `Bearer ${VIMEO_TOKEN}`,
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  return createRes.data.uri.split("/").pop();
};

// Delete from Vimeo
export const deleteFromVimeo = async (videoId) => {
  await axios.delete(`https://api.vimeo.com/videos/${videoId}`, {
    headers: {
      Authorization: `Bearer ${VIMEO_TOKEN}`,
    },
  });
};
