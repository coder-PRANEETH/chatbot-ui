import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import User from "./schema.js";

const app = express();
const uri = "mongodb+srv://killer2:killerab@userdata.dicwtud.mongodb.net/";

const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// ✅ Connect to DB
async function run() {
  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB!");
  } catch (err) {
    console.error("❌ Database connection error:", err);
  }

  // ✅ Simple ping route
  app.get("/chatbot", (req, res) => {
    res.json("contacted server");
  });

  // ✅ Upload PDF documents
  app.post("/documents", upload.array("pdfs", 15), async (req, res) => {
    try {
      const uploadedFiles = req.files.map(file => ({
        filename: file.originalname,
        data: file.buffer,
        contentType: file.mimetype,
        size: file.size,
      }));

      let user = await User.findOne({ username: "john_doe" });
      if (!user) user = new User({ username: "john_doe", files: [], chats: [] });

      user.files.push(...uploadedFiles);
    await user.save({ validateBeforeSave: false });

      res.json({ message: "Files uploaded successfully!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to upload files" });
    }
  });

  app.post("/chat", async (req, res) => {
  try {
    let user = await User.findOne({ username: "john_doe" });


    if (!user) user = new User({ username: "john_doe", files: [], chats: [] });

 
    const existingChat = user.chats.find(c => c.name === req.body.name);

    if (existingChat) {
    
      existingChat.messages.push(...req.body.messages);
    } else {
      // ✅ Create a new chat entry
      user.chats.push({
        name: req.body.name,
        messages: req.body.messages
      });
    }

    // ✅ Save without revalidating old file entries
    await user.save({ validateBeforeSave: false });

    res.json({ message: "Chat saved successfully!" });
  } catch (err) {
    console.error("Error saving chat:", err);
    res.status(500).json({ error: "Failed to save chat" });
  }
});

  // ✅ Get only chat names
  app.get("/chatnames", async (req, res) => {
    try {
      const user = await User.findOne({ 
username:
"john_doe" })
        .select("username chats.name -_id");

      if (!user) {
      throw Error}
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch chat names" });
    }
  });

  // ✅ Get messages for one chat
  app.get("/chats/:cname", async (req, res) => {
    try {
      const user = await User.findOne({ username: "john_doe" });
      if (!user) return res.status(404).json({ message: "User not found" });

      const chat = user.chats.find(c => c.name === req.params.cname);
      if (!chat) return res.status(404).json({ message: "Chat not found" });

      res.json(chat);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch chat" });
    }
  });

app.get("/files", async (req, res) => {
  try {
    const user = await User.findOne({ username: "john_doe" }).select("files.filename files.size files.uploadedAt -_id");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.files);
  } catch (err) {
    console.error("Error listing files:", err);
    res.status(500).json({ error: "Failed to list files" });
  }
});

app.get("/files/:filename", async (req, res) => {
  try {
    // 1️⃣ Find the user
    const user = await User.findOne({ username: "john_doe" });
    if (!user) return res.status(404).json({ error: "User not found" });

    // 2️⃣ Find the file in user's files array
    const file = user.files.find(f => f.filename === req.params.filename);
    if (!file) return res.status(404).json({ error: "File not found" });

    // 3️⃣ Log for debugging (optional)
    console.log(`Serving file: ${file.filename} (${file.size} bytes)`);

    // 4️⃣ Set correct headers
    res.set({
      "Content-Type": file.contentType || "application/pdf",
      "Content-Disposition": `inline; filename="${file.filename}"`,
      "Content-Length": file.size || file.data.length,
    });

    // 5️⃣ Send raw binary data
    res.send(file.data);
  } catch (err) {
    console.error("Error fetching file:", err);
    res.status(500).json({ error: "Failed to fetch file" });
  }
});




}

run();

app.listen(5000, () => {
  console.log(`🚀 Server running on http://localhost:5000`);
});
