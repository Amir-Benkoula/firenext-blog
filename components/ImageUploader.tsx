import { useState } from 'react';
import { auth, storage, STATE_CHANGED } from '../lib/firebase';
import Loader from './Loader';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// Uploads images to Firebase Storage
export default function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);
  let fileToBlob: Blob;

  // Creates a Firebase Upload Task
  const uploadFile = async (e: React.FormEvent<HTMLInputElement>) => {
    // Get the file
    const file = e.currentTarget.files?.item(0);
    const extension = file?.name.split('.')[0];
    // Makes reference to the storage bucket location
    const fileRef = ref(storage, `uploads/${auth.currentUser?.uid}/${Date.now()}.${extension}`);
    setUploading(true);

    // Converts the file to Blob Object
    file?.arrayBuffer().then((arrayBuffer) => {
      fileToBlob = new Blob([new Uint8Array(arrayBuffer)], {type: file.type });
    })
    // Starts the upload
    const task = uploadBytesResumable(fileRef, fileToBlob)

    // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
    task
      .then((d) => getDownloadURL(fileRef))
      .then((url: any) => {
        setDownloadURL(url);
        setUploading(false);
      });
  };

  return (
    <div className="box">
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}

      {!uploading && (
        <>
          <label className="btn">
            📸 Ajouter une Image
            <input type="file" onChange={uploadFile} accept="image/x-png,image/gif,image/jpeg" />
          </label>
        </>
      )}
      
      {downloadURL && <code className="upload-snippet">{`![alt](${downloadURL})`}</code>}
    </div>
  );
}
