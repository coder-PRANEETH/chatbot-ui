import './sidebar.css';
import { useState, useEffect } from 'react';
import { getchatnames } from './functions';

export default function Sidebar({ Setchat, Setdocvisible, docvisible }) {
  const [chnames, setchnames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        
        const data = await getchatnames();
        setchnames(data.chats || []);
      } catch (err) {
        console.error("Error fetching chat names:", err);
        setchnames([]);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  const char = chnames.length > 0 ? (
    chnames.map((chat, index) => (
      <div
        key={index}
        className="cha"
        onClick={() => Setchat(chat.name)}
      >
        <span>{chat.name}</span>
      </div>
    ))
  ) : (
    <div className="no-chats">
      {loading ? "Loading chats..." : "No chat history found"}
    </div>
  );

  const handledoc = () => {
    Setdocvisible(!docvisible);
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-labelledby="title2">
          <title id="title2">Egg Farming Brand — Icon</title>
          <defs>
            <linearGradient id="yolk2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFC145" />
              <stop offset="1" stopColor="#FFA500" />
            </linearGradient>
          </defs>
          <path d="M60 5 C88 5,110 37,110 72 C110 101,90 115,60 115 C30 115,10 101,10 72 C10 37,32 5,60 5Z"
            fill="#fff" stroke="#1e1e1e" strokeWidth="3" />
          <circle cx="60" cy="72" r="18" fill="url(#yolk2)" />
          <path d="M60 52 c -10 -14 -28 -16 -36 -8 c 6 10 24 12 36 8Z" fill="#3BB273" />
          <path d="M60 52 c 10 -14 28 -16 36 -8 c -6 10 -24 12 -36 8Z" fill="#2F9E67" />
          <path d="M60 52 C60 70 60 88 60 88" stroke="#2F8F53" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <h2>Ova Farms</h2>
      </div>

      <div className="pages">
        <div className="butgroup">
          <button onClick={handledoc} className="documents">
            <h2>Documents</h2>
          </button>
          <button className="chats">
            <h2>Chats</h2>
          </button>
        </div>
      </div>

      <h1>History</h1>
      <div className="charts">
        {char}
      </div>
    </div>
  );
}
