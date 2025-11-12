import './Docu.css';

import { useEffect, useState } from 'react';

import Documentpopup from './documentpopup';

import { getfilenames, getfile } from './functions';

export default function Docu()
{

  const [selectedFile, setSelectedFile] = useState(null);

  const [uplod, Setuplod] = useState(false);

  const [filenames, Setfilename] = useState([]);

  const [loading, setLoading] = useState(false);

  const openFile = async (file) => {
    setSelectedFile(file);
    setLoading(true);
    const url = await getfile(file.filename);
    if (url) {
      setLoading(false);
      
    }
  };

  useEffect(() => {
    const fetchFiles = async () => {
      const files = await getfilenames();
      Setfilename(files || []);
    };
    fetchFiles();
  }, []);

  return (
    <>
      {uplod ? (
        <Documentpopup Setuplod={Setuplod} />
      ) : (
        <>
          {!selectedFile ? (
            <div className="docu">
              <h1>Documents</h1>
              <div className="document">
                {filenames.map((file, index) => (
                  <div
                    key={file.filename + index}
                    className="pretext"
                    onClick={() => openFile
                      (file)}
                  >
                    <span>{file.filename}</span>
                    <div className="meta">
                      {(file.size / 1024).toFixed(1)} KB —{" "}
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => Setuplod(true)} className="upad">
                UPLOAD MORE
              </button>
            </div>
          ) : loading ? (
            <div className="docu">

            <div className="title">LOADING...</div>
            </div>
          ) : (
            <div className="docu">
              <div className="prefile">
                <div className="upper">
                  <div className="tite">{selectedFile.filename}</div>
                  <div className="clse" onClick={() => setSelectedFile(null)}>
                    ×
                  </div>
                </div>

               
                  <iframe
                    src={`http://localhost:5000/files/${selectedFile.filename}`}

                    title={selectedFile.filename}
                    width="100%"
                    height="100%"
                   
                  ></iframe>
               
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
