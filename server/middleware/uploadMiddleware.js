// server/middlewares/uploadMiddleware.js
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const base = path.basename(file.originalname || "file", ext)
      .replace(/\s+/g, "_")
      .slice(0, 60);
    const name = `${Date.now()}_${base}${ext}`;
    cb(null, name);
  },
});

export const uploadSingle = multer({ storage }).single("file");
