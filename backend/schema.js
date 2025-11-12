import mongoose from "mongoose";

const { Schema } = mongoose;

// File schema storing the PDF directly
const fileSchema = new Schema({
  filename: {
    type: String,
    required: true,
  },
  data: {
    type: Buffer,   // Binary data for the PDF
    required: true,
  },
  contentType: {
    type: String,   // e.g. "application/pdf"
    default: "application/pdf",
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

// Chat schema for question-answer pairs
const chatEntrySchema = new Schema({
  question: String,
  answer: String,
});

// Chat session schema
const chatSchema = new Schema({
  name: String,
  messages: [chatEntrySchema],
});

// User schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  files: [fileSchema], // store PDF as binary
  chats: [chatSchema],
});

const User = mongoose.model("User", userSchema);
export default User;
