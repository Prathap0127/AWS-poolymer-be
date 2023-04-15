import express from "express";
import {
  loginController,
  registerController,
  respoController,
} from "../controller/AuthController.js";

const router = express.Router();

//register

router.post("/register", registerController);

//login post
router.post("/login", loginController);

//respo

router.get("/respo", respoController);

export default router;
