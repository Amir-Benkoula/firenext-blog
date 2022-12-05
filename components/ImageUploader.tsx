import { useState } from "react";
import { auth, storage } from "../lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Button, Upload } from "antd";
import { FileImageOutlined, FileImageTwoTone } from "@ant-design/icons";

// Uploads images to Firebase Storage
export default function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  // Creates a Firebase Upload Task
  const uploadFile = async (e: React.FormEvent<HTMLInputElement>) => {
    // Get the file
    const file = e.currentTarget.files?.item(0);
    const extension = file?.name.split(".").pop();
    // Makes reference to the storage bucket location
    const fileRef = ref(
      storage,
      `uploads/${auth.currentUser?.uid}/${Date.now()}.${extension}`
    );
    setUploading(true);

    // Starts the upload
    //@ts-ignore
    const task = uploadBytesResumable(fileRef, file);

    task.on("state_changed", (snapshot) => {
      const pct = +(
        (snapshot.bytesTransferred / snapshot.totalBytes) *
        100
      ).toFixed(0);
      setProgress(pct);
    });

    // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
    task
      .then((d) => getDownloadURL(fileRef))
      .then((url: any) => {
        setDownloadURL(url);
        setUploading(false);
      });
  };

  return (
    <div>
      {uploading && <h3>{progress}%</h3>}

      {!uploading && (
        <div>
          <label style={{ cursor: "pointer" }} htmlFor="file">
            <FileImageOutlined style={{ fontSize: "2em", color: "gray" }} />
          </label>
          <input
            id="file"
            type="file"
            onChange={uploadFile}
            accept="image/x-png,image/gif,image/jpeg"
            style={{ display: "none" }}
          />
        </div>
      )}

      {downloadURL && (
        <p>
          <code>{`![alt](${downloadURL})`}</code>
        </p>
      )}
    </div>
  );
}
