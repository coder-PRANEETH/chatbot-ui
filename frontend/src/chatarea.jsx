import './chatarea.css';
import { useState, useEffect } from 'react';
import { generateChatName,postchat,fetchresponse, fullchat } from './functions';

export default function Chat({ newchat, Setnewchat, docvisible, chat, Setchat }) {
  const [data, setData] = useState([]); // messages from database
  const [message, setMessage] = useState(''); // current input
  const [userMessages, setUserMessages] = useState([]); // current session messages
  const [loading, setLoading] = useState(false);

useEffect(() => {
  const handleChatTransition = async () => {
    try {
      // ✅ 1. If there are unsaved messages in the current chat, save them first
      if (userMessages.length > 0 && chat) {
        await postchat(chat, userMessages);
        console.log(`Saved chat: ${chat}`);
        setUserMessages([]); // clear local buffer
      }
      else if (userMessages.length > 0 && !chat) {
        const name = generateChatName(userMessages);
        await postchat(name, userMessages);
        console.log(`Saved chat: ${name}`);
        setUserMessages([]); 
      }
      if (newchat) {
        setUserMessages([]);
        setData([]);
        setMessage('');
        Setnewchat(false);
        Setchat("");
        return; // stop here, don’t load anything
      }

      // ✅ 3. Load messages for the newly selected chat
      if (!chat) return;

      setLoading(true);
      setData(["loading"]);
      const res = await fullchat(chat);

      if (res && res.messages) {
        setData(res.messages);
      } else {
        setData([]);
      }

    } catch (err) {
      console.error("Chat transition error:", err);
    } finally {
      setLoading(false);
    }
  };

  handleChatTransition();
}, [chat, newchat]);


  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userQ = message;
    setMessage('');

    // Add immediately to UI
    setUserMessages((prev) => [...prev, { question: userQ, answer: "..." }]);

    try {
      const res = await fetchresponse(); // dummy response (you’ll replace this with AI)
      const answer = res?.answer || "Chatbot response not implemented yet.";

      setUserMessages((prev) =>
        prev.map((msg) =>
          msg.question === userQ ? { ...msg, answer } : msg
        )
      );
    } catch (err) {
      console.error("Message send failed:", err);
    }
  };

  // ✅ Chat width class
  const widthClass = docvisible ? "widthfa" : "widthha";

  const placeholder = userMessages.length === 0 && data.length === 0;

  return (
    <div className={`chat ${widthClass}`}>
      <div className="chatarea">
        {/* Empty Chat Placeholder */}
        {placeholder && (
          <div className="empty">
            <h2>Ask questions from the uploaded files</h2>
            <div className="loago">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-labelledby="title2">
                <title id="title2">Egg Farming Brand — Icon</title>
                <defs>
                  <linearGradient id="yolk2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#FFC145" />
                    <stop offset="1" stopColor="#FFA500" />
                  </linearGradient>
                </defs>
                <path
                  d="M60 5 C88 5,110 37,110 72 C110 101,90 115,60 115 C30 115,10 101,10 72 C10 37,32 5,60 5Z"
                  fill="#fff" stroke="#1e1e1e" strokeWidth="3"
                />
                <circle cx="60" cy="72" r="18" fill="url(#yolk2)" />
                <path d="M60 52 c -10 -14 -28 -16 -36 -8 c 6 10 24 12 36 8Z" fill="#3BB273" />
                <path d="M60 52 c 10 -14 28 -16 36 -8 c -6 10 24 12 36 8Z" fill="#2F9E67" />
                <path d="M60 52 C60 70 60 88 60 88" stroke="#2F8F53" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <h2>Ova Farms</h2>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && <div className="loading">Loading chat...</div>}

        {/* Database chat messages */}
        {data.map((item, index) => (
          <div key={`data-${index}`}>
            <div className="question">{item.question}</div>
            <div className="answer">{item.answer}</div>
          </div>
        ))}

        {/* Live user session messages */}
        {userMessages.map((item, index) => (
          <div key={`user-${index}`}>
            <div className="question">{item.question}</div>
            <div className="answer">{item.answer}</div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form className="text" id="form" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Enter a message"
          id="messagei"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="send">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13" />
            <path d="M22 2L15 22l-4-9-9-4 20-7z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
