import { Router } from "express";
import stripeController from "../controllers/stripe.js";

const router = Router();

router.post(
  "/create-checkout-session",
  stripeController.createCheckoutSession,
);
router.get("/session-status", stripeController.getSessionStatus);

export default router;
