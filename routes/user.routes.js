import express from "express"
import {
  login,
  registerUser,
  verifyUser,
} from "../controller/user.controller.js";

const router = express.Router();

router.get("/verify/:token", verifyUser);
router.post("/register", registerUser);
router.post("/login", login);

export default router;