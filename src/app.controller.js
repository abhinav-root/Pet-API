import express from "express";
import multer from "multer";
import { addPets } from "./app.service.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

// Routes
router.post("/pet", upload.single("pets"), addPets);

export default router;
