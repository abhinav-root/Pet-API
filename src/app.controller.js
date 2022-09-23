import express from "express";
import { body } from "express-validator";
import multer from "multer";
import {
  addPets,
  getAllPets,
  getPetById,
  updatePetById,
  deleteById,
} from "./app.service.js";
import errorMiddleware from "./middlewares/errors.js";

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

router.get("/pet", getAllPets);

router.get("/pet/:petId", getPetById);

router.patch(
  "/pet/:petId",
  body("name").isString(),
  body("type").isString().optional(),
  body("breed").isString().optional(),
  body("age").isInt({ min: 1, max: 50 }).optional(),
  errorMiddleware,
  updatePetById
);

router.delete("/pet/:petId", deleteById);

export default router;
