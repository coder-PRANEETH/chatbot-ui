import './documentpopup.css';
import { useState } from 'react';
import { uploaddoc } from './functions';

export default function Documentpopup({ Setuplod }) {
  const [fil, setFil] = useState([]);
  const [upl, setupl] = useState("");
  const [load, setload] = useState(false);

  const upserver = async () => {
    if (fil.length === 0) {
      setupl("Please select at least one file");
      return;
    }

    setload(true);   // show loading state before upload
    setupl("");      // clear old messages

    try {
      const res = await uploaddoc(fil);
      setload(false);  // stop loading when upload done

      if (res === "error") {
        setupl("❌ Error uploading files");
      } else {
        setupl("✅ Uploaded successfully!");
      }
    } catch (err) {
      console.error(err);
      setload(false);
      setupl("❌ Upload failed due to network error");
    }
  };

  const fileupload = (e) => {
    const files = Array.from(e.target.files);
    setFil(files);
  };

  const closePopup = (e) => {
    e.preventDefault();
    Setuplod(false);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <>
      <div className="documentpopup">
        <div className="docucontain">
          <div className="hea">
            <h2>Upload Documents</h2>
            <button onClick={closePopup} className="close">×</button>
          </div>

          {/* File preview section */}
          <div className="uploaded">
            {fil.length > 0 &&
              fil.map((file, index) => (
                <div className="preview" key={index}>
                  <div className="title">{file.name}</div>
                  <div className="size">{formatSize(file.size)}</div>
                </div>
              ))}
          </div>

          {/* File input */}
          <label className="custom-file-upload">
            <input
              onChange={fileupload}
              name="file"
              type="file"
              multiple
              accept="application/pdf"
            />
            📁 Choose Files
          </label>

          {/* Upload button */}
          <button onClick={upserver} id="submit" disabled={load}>
            {load ? "Uploading..." : "Upload"}
          </button>

          {/* Status / Loading messages */}
          {upl && <div className="status">{upl}</div>}
          {load && <div className="loading">⏳ Uploading documents...</div>}
        </div>
      </div>

      <div className="overlay"></div>
    </>
  );
}
