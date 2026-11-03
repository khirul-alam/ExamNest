// backend/src/index.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

const app = express();

// .env ফাইল থেকে কনফিগারেশন পড়া
const PORT = Number(process.env.PORT) || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// নিরাপত্তা হেডার যুক্ত করা
app.use(helmet());

// ফ্রন্টএন্ড থেকে কুকিসহ রিকোয়েস্ট গ্রহণের অনুমতি
app.use(cors({ origin: CLIENT_URL, credentials: true }));

app.use(express.json());
app.use(cookieParser());

// সার্ভার ও ডাটাবেজ ঠিক আছে কিনা পরীক্ষার রুট
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "ExamNest API",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

async function start() {
  if (!MONGODB_URI) {
    console.error("❌ .env ফাইলে MONGODB_URI পাওয়া যায়নি");
    process.exit(1);
  }

  // আগে ডাটাবেজ কানেক্ট, তারপর সার্ভার চালু
  await mongoose.connect(MONGODB_URI);
  console.log("✅ MongoDB কানেক্টেড");

  app.listen(PORT, () => {
    console.log(`🚀 ExamNest API চলছে: http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error("❌ সার্ভার চালু করা যায়নি:", error);
  process.exit(1);
});