import express from "express";
import {
  loginController,
  registerController,
  respoController,
  respoSearchController,
} from "../controller/AuthController.js";
import { requireSignIn } from "../middleware/authMiddle.js";

const router = express.Router();

//register

router.post("/register", registerController);

//login post
router.post("/login", loginController);

//protected User route
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//respo

router.get("/respo", respoController);

router.get("/resposearch", respoSearchController);

export default router;
