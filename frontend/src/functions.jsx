// 📘 generateChatName.js

/**
 * Generates a readable, unique chat name from the first question.
 * @param {Array} userMessages - Array of chat messages [{ question, answer }]
 * @param {Array} existingChats - (optional) Array of existing chat names to avoid duplicates
 * @returns {string} Generated chat name
 */
export function generateChatName(userMessages, existingChats = []) {
  if (!userMessages || userMessages.length === 0) {
    return "Untitled Chat";
  }

  // ✅ Get first question text
  let baseName = userMessages[0].question || "Untitled Chat";

  // ✅ Clean up: remove punctuation, extra spaces, and lowercase
  baseName = baseName
    .trim()
    .replace(/[^\w\s]/g, "") // remove punctuation
    .replace(/\s+/g, " ") // normalize spaces
    .split(" ") // split into words
    .slice(0, 4) // take first few words only
    .join(" "); // join back

  // ✅ Capitalize first letter
  baseName = baseName.charAt(0).toUpperCase() + baseName.slice(1);

  // ✅ Fallback if empty after cleanup
  if (!baseName || baseName.length === 0) baseName = "Untitled Chat";

  // ✅ Add suffix if duplicate name exists
  let finalName = baseName;
  let counter = 1;
  while (existingChats.includes(finalName)) {
    finalName = `${baseName} (${counter++})`;
  }

  return finalName;
}
// 🧠 1. Fetch server test route







export async function fetchresponse() {
  try {
    const response = await fetch("http://localhost:5000/chatbot");

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Server says:", data);
    return data;

  } catch (err) {
    console.error("Fetch failed:", err.message);
    return { error: "Cannot fetch a response" };
  }
}


// 📂 2. Upload PDF files to backend
export async function uploaddoc(files) {
  try {
    const formData = new FormData();

    // append multiple PDFs
    files.forEach(file => formData.append("pdfs", file));

    const response = await fetch("http://localhost:5000/documents", {
      method: "POST",
      body: formData, // no Content-Type — browser sets automatically
    });

    if (!response.ok) throw new Error("Upload failed");

    const data = await response.json();
    console.log("Upload success:", data);
    return data;
  } catch (err) {
    console.error("Upload error:", err);
    return "error";
  }
}


// 💬 3. Get all chat names only
export async function getchatnames() {
  try {
    const response = await fetch("http://localhost:5000/chatnames");

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.log("Error fetching chat names:", err);
    return { chats: [] };
  }
}

export async function getfilenames() {
  try {
    const response = await fetch("http://localhost:5000/files");

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.log("Error fetching chat names:", err);
    return { chats: [] };
  }
}


export async function getfile(filename) {
  try {
    const res = await fetch(`http://localhost:5000/files/${filename}`);
    if (!res.ok) throw new Error(`Server responded with ${res.status}`);

    const blob = await res.blob();

    // ✅ Ensure blob has correct MIME type
    const pdfBlob = new Blob([blob], { type: "application/pdf" });

    const fileURL = URL.createObjectURL(pdfBlob);
    return fileURL;
  } catch (err) {
    console.error("Error fetching file:", err);
    return null;
  }
}



// 💭 4. Get full chat (messages) for a chat name
export async function fullchat(cname) {
  try {
    // Use template literal — cname variable
    const response = await fetch(`http://localhost:5000/chats/${cname}`);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching full chat:", err);
    return "error";
  }
}

export async function postchat(chatName, messages) {
  try {
    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: chatName,
        messages: messages
      }),
    });

    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();
    console.log("Chat saved:", data);
    return data;
  } catch (err) {
    console.error("Error saving chat:", err);
    return "error";
  }
}
