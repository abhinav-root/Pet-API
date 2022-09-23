import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./app.controller.js";
dotenv.config();

function main() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      const app = express();
      const port = process.env.PORT || 4000;
      app.use(express.json());
      app.use("/api", router);
      app.listen(port, () => console.log(`server started on port ${port}`));
    })
    .catch((err) => console.log(err));
}

main();
